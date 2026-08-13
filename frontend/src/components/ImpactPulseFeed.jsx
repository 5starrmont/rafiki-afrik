import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contentAPI } from '../services/api';

// Minimalist SVGs matching the main Impact Pulse page
const PlayIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6.5 4.5v15c0 1.1.9 1.5 1.5.8l11.5-7.5c.6-.4.6-1.3 0-1.7l-11.5-7.5c-.6-.7-1.5-.3-1.5.8z" />
  </svg>
);
const ArrowRightIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const ClockIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const VideoIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>;
const ImageIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>;

// Secure slug generator to obfuscate DB IDs
const createSecureSlug = (title, type, id) => {
  const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const encodedData = btoa(`${type}:${id}`).replace(/=/g, ''); 
  return `${safeTitle}-${encodedData}`;
};

export default function ImpactPulseFeed() {
  const [latestContent, setLatestContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestContent = async () => {
      try {
        const [articlesRes, videosRes] = await Promise.all([
          contentAPI.getArticles(),
          contentAPI.getVideos()
        ]);
        
        const articlesData = articlesRes.data || [];
        const videosData = videosRes.data || [];
        const now = new Date();

        const formattedArticles = articlesData
          .filter(a => a.is_published && new Date(a.published_date || a.created_at) <= now)
          .map(a => {
            const timeStr = a.reading_time || '5 min';
            return {
              id: a.id,
              title: a.title,
              cType: 'article',
              displayDate: a.published_date || a.created_at || now.toISOString(),
              img: a.featured_image,
              category: a.category?.name || 'Uncategorized',
              readTime: timeStr.toLowerCase().includes('read') ? timeStr : `${timeStr} read`
            };
          });

        const formattedVideos = videosData
          .filter(v => v.is_published && new Date(v.published_date || v.created_at) <= now)
          .map(v => ({
            id: v.id,
            title: v.title,
            cType: 'video',
            displayDate: v.published_date || v.created_at || now.toISOString(),
            img: v.thumbnail,
            category: v.category?.name || 'Uncategorized',
            readTime: 'Video'
          }));

        // Combine, sort by newest, and slice the top 4 for the homepage
        const combined = [...formattedArticles, ...formattedVideos]
          .sort((a, b) => new Date(b.displayDate).getTime() - new Date(a.displayDate).getTime())
          .slice(0, 4);

        setLatestContent(combined);
      } catch (error) {
        console.error("Error fetching Impact Pulse feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestContent();
  }, []);

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-5xl md:text-6xl font-heading font-black text-primary tracking-tight leading-[1.05] mb-3">
              Impact <span className="text-secondary">Pulse.</span>
            </h2>
            <p className="text-gray-600 font-body text-lg md:text-xl font-medium max-w-2xl">
              Spotlighting Change.
            </p>
          </div>
          <Link 
            to="/impact-pulse" 
            className="hidden md:inline-flex items-center gap-2 text-secondary font-bold text-sm uppercase tracking-wider hover:opacity-80 transition-opacity"
          >
            Explore <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex flex-col">
                <div className="w-full aspect-[4/3] bg-gray-200 rounded-2xl mb-4" />
                <div className="h-3 w-24 bg-gray-200 rounded-full mb-3" />
                <div className="h-6 w-full bg-gray-200 rounded-lg mb-2" />
                <div className="h-6 w-3/4 bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
        ) : latestContent.length === 0 ? (
          <div className="py-12 text-center bg-gray-50 rounded-3xl border border-gray-100">
            <p className="text-gray-500 font-medium">No publications available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {latestContent.map((post) => (
              <Link 
                key={`${post.cType}-${post.id}`} 
                to={`/impact-pulse/${createSecureSlug(post.title, post.cType, post.id)}`} 
                className="group flex flex-col h-full bg-white rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 rounded-2xl mb-4 sm:mb-5 shadow-sm group-hover:shadow-md transition-shadow">
                  {post.img ? (
                    <img
                      src={post.img}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-gray-300" />
                    </div>
                  )}
                  
                  {post.cType === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors duration-500">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-secondary transition-all duration-300">
                        <PlayIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary ml-1 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-grow px-1">
                  <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                    <span className="text-secondary">{post.category}</span>
                    <span className="text-gray-300">•</span>
                    {post.cType === 'article' ? (
                      <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" /> {post.readTime}</span>
                    ) : (
                      <span className="flex items-center gap-1"><VideoIcon className="w-3 h-3" /> Video</span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-heading font-black text-primary leading-tight mb-4 group-hover:text-secondary transition-colors line-clamp-3">
                    {post.title}
                  </h3>

                  <div className="mt-auto flex items-center justify-between text-gray-400 text-[11px] sm:text-xs font-bold pt-4 border-t border-gray-100 uppercase tracking-wider">
                    <span>
                      {new Date(post.displayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <ArrowRightIcon className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Mobile View All Button */}
        {!loading && latestContent.length > 0 && (
          <div className="mt-10 md:hidden text-center">
            <Link 
              to="/impact-pulse" 
              className="inline-flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-primary font-bold text-sm uppercase tracking-wider px-6 py-4 rounded-xl w-full transition-colors"
            >
              Explore <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}