import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { contentAPI } from '../services/api'

// Minimalist SVGs
const PlayIcon = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>;
const ArrowRightIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const ClockIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const VideoIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>;
const ChevronLeftIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevronRightIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>;
const ImageIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>;
const SearchXIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35M8.5 8.5l5 5M13.5 8.5l-5 5"/></svg>;

export default function ImpactPulse() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFormat, setActiveFormat] = useState('all');
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [articlesRes, videosRes] = await Promise.all([
          contentAPI.getArticles(),
          contentAPI.getVideos()
        ])
        setArticles(articlesRes.data || [])
        setVideos(videosRes.data || [])
      } catch (error) {
        console.error("Error fetching Impact Pulse:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  const allContent = useMemo(() => {
    const now = new Date();

    const formattedArticles = articles
      .filter(a => {
        // Kick out drafts
        if (!a.is_published) return false;
        // Kick out future scheduled posts
        const pubDate = new Date(a.published_date || a.created_at || now);
        return pubDate <= now;
      })
      .map(a => {
        const timeStr = a.reading_time || '5 min';
        return {
          id: a.id,
          slug: a.slug,
          title: a.title,
          cType: 'article',
          displayDate: a.published_date || a.created_at || now.toISOString(),
          img: a.featured_image,
          category: a.category?.name || 'Uncategorized',
          author: a.author || 'Rafiki Afrik',
          readTime: timeStr.toLowerCase().includes('read') ? timeStr : `${timeStr} read`
        };
      });

    const formattedVideos = videos
      .filter(v => {
        // Kick out drafts
        if (!v.is_published) return false;
        // Kick out future scheduled posts
        const pubDate = new Date(v.published_date || v.created_at || now);
        return pubDate <= now;
      })
      .map(v => ({
        id: v.id,
        title: v.title,
        cType: 'video',
        displayDate: v.published_date || v.created_at || now.toISOString(),
        img: v.thumbnail,
        category: v.category?.name || 'Uncategorized',
        url: v.youtube_url,
        author: 'Rafiki Afrik',
        readTime: 'Video'
      }));

    return [...formattedArticles, ...formattedVideos].sort(
      (a, b) => new Date(b.displayDate).getTime() - new Date(a.displayDate).getTime()
    );
  }, [articles, videos]);

  const categories = useMemo(() => {
    const cats = allContent.map(c => c.category);
    return ['All', ...new Set(cats)];
  }, [allContent]);

  const filteredContent = useMemo(() => {
    return allContent.filter(c => {
      const matchCategory = activeCategory === 'All' || c.category === activeCategory;
      const matchFormat = activeFormat === 'all' || c.cType === activeFormat;
      return matchCategory && matchFormat;
    });
  }, [allContent, activeCategory, activeFormat]);

  const scrollCategories = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const heroPost = filteredContent[0];
  const gridPosts = filteredContent.slice(1);

  if (loading) return <ImpactPulseSkeleton />;

  return (
    <div className="min-h-screen bg-[#FDFCFB] relative font-body text-gray-800 pb-24">

      {/* ── Ambient Header ── */}
      <header className="relative pt-32 pb-8 overflow-hidden bg-gradient-to-b from-orange-50/40 to-[#FDFCFB]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute top-24 left-0 w-[320px] h-[320px] bg-primary/[0.04] rounded-full blur-3xl -translate-x-1/3 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-10">
            <h1 className="text-5xl md:text-7xl font-heading font-black text-primary tracking-tight leading-[1.05] mb-4">
              Impact <span className="text-secondary">Pulse.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
              Spotlighting Change.
            </p>
          </div>

          {/* ── Floating Pill Filter Bar ── */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-2.5 rounded-[2rem] lg:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 w-full xl:max-w-6xl">

            {/* Scrollable Category Container */}
            <div className="relative flex-1 w-full overflow-hidden flex items-center group pl-2 min-w-0">
              <button
                type="button"
                onClick={() => scrollCategories('left')}
                aria-label="Scroll categories left"
                className="absolute left-0 z-10 p-2 h-full bg-gradient-to-r from-white via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center"
              >
                <ChevronLeftIcon className="w-5 h-5 text-gray-500 hover:text-primary transition-colors" />
              </button>

              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-2 scroll-smooth w-full px-1 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    aria-pressed={activeCategory === cat}
                    className={`snap-start whitespace-nowrap px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                      activeCategory === cat
                        ? "bg-primary text-white shadow-md"
                        : "bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollCategories('right')}
                aria-label="Scroll categories right"
                className="absolute right-0 z-10 p-2 h-full bg-gradient-to-l from-white via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center"
              >
                <ChevronRightIcon className="w-5 h-5 text-gray-500 hover:text-primary transition-colors" />
              </button>
            </div>

            {/* Segmented Format Toggle */}
            <div className="flex bg-gray-50 p-1.5 rounded-full border border-gray-100 shrink-0 w-full lg:w-auto">
              {[
                { id: 'all', label: 'All' },
                { id: 'article', label: 'Articles' },
                { id: 'video', label: 'Videos' }
              ].map(format => (
                <button
                  key={format.id}
                  type="button"
                  onClick={() => setActiveFormat(format.id)}
                  aria-pressed={activeFormat === format.id}
                  className={`flex-1 lg:flex-none px-4 sm:px-6 py-2.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    activeFormat === format.id
                      ? "bg-white text-gray-900 shadow-sm border border-gray-200/50"
                      : "text-gray-400 hover:text-gray-900"
                  }`}
                >
                  {format.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        {filteredContent.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* ── Contained Hero Overlay Feature ── */}
            {heroPost && (
              <section className="mb-12 sm:mb-16">
                {heroPost.cType === 'video' ? (
                  <a href={heroPost.url} target="_blank" rel="noopener noreferrer" className="block group rounded-[2rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-4">
                    <HeroCard post={heroPost} />
                  </a>
                ) : (
                  <Link to={`/impact-pulse/${heroPost.slug || heroPost.id}`} className="block group rounded-[2rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-4">
                    <HeroCard post={heroPost} />
                  </Link>
                )}
              </section>
            )}

            {/* ── Clean Editorial Grid ── */}
            {gridPosts.length > 0 && (
              <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 sm:gap-y-16">
                {gridPosts.map((post) => (
                  <div key={post.id}>
                    {post.cType === 'video' ? (
                      <a href={post.url} target="_blank" rel="noopener noreferrer" className="block group h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2">
                        <GridCard post={post} />
                      </a>
                    ) : (
                      <Link to={`/impact-pulse/${post.slug || post.id}`} className="block group h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2">
                        <GridCard post={post} />
                      </Link>
                    )}
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}

// Sub-component: Contained Hero Layout with Text Overlay
const HeroCard = ({ post }) => (
  <div className="relative w-full aspect-square sm:aspect-[4/3] md:aspect-[21/9] lg:aspect-[2.5/1] rounded-[2rem] overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-gray-900">
    {/* Background Image or fallback */}
    {post.img ? (
      <img
        src={post.img}
        alt={post.title}
        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105"
      />
    ) : (
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/60 flex items-center justify-center">
        <ImageIcon className="w-16 h-16 text-white/20" />
      </div>
    )}

    {/* Dark Gradient Overlay for perfect text readability */}
    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 sm:via-gray-900/40 to-transparent" />

    {/* Text Content Anchored to Bottom Left */}
    <div className="absolute bottom-0 left-0 p-5 sm:p-8 md:p-12 w-full z-20">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/90 mb-3 sm:mb-5">
        <span className="bg-secondary text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">{post.category}</span>
        {post.cType === 'article' ? (
          <span className="flex items-center gap-1 sm:gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full"><ClockIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {post.readTime}</span>
        ) : (
          <span className="flex items-center gap-1 sm:gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full"><VideoIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Video</span>
        )}
      </div>

      <h2 className="text-2xl sm:text-4xl lg:text-6xl font-heading font-black text-white leading-[1.15] mb-4 sm:mb-6 group-hover:text-orange-50 transition-colors duration-300 max-w-4xl line-clamp-3 md:line-clamp-none">
        {post.title}
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/20 pt-4 sm:pt-6">
        <div className="text-white/80 text-[11px] sm:text-sm font-medium">
          By <span className="text-white font-bold">{post.author}</span>
          <span className="mx-2 sm:mx-3">•</span>
          {new Date(post.displayDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>

        <div className="inline-flex items-center gap-2 text-white font-bold text-xs sm:text-sm bg-white/10 group-hover:bg-white/20 backdrop-blur-md px-4 sm:px-5 py-2.5 rounded-full transition-colors border border-white/10 w-fit">
          {post.cType === 'video' ? (
            <>Watch Now <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" /></>
          ) : (
            <>Read Story <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" /></>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Sub-component: Editorial Grid Layout
const GridCard = ({ post }) => (
  <div className="flex flex-col h-full">
    <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 rounded-2xl mb-4 sm:mb-6 shadow-sm group-hover:shadow-md transition-shadow">
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
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <PlayIcon className="h-6 w-6 sm:h-7 sm:w-7 text-primary ml-1 sm:ml-1.5" />
          </div>
        </div>
      )}
    </div>

    <div className="flex flex-col flex-grow">
      <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 sm:mb-4">
        <span className="text-secondary">{post.category}</span>
        <span className="text-gray-300">•</span>
        {post.cType === 'article' ? (
          <span className="flex items-center gap-1 sm:gap-1.5"><ClockIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {post.readTime}</span>
        ) : (
          <span className="flex items-center gap-1 sm:gap-1.5"><VideoIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Video</span>
        )}
      </div>

      <h3 className="text-xl sm:text-2xl font-heading font-black text-primary leading-tight mb-4 sm:mb-5 group-hover:opacity-80 transition-opacity line-clamp-3">
        {post.title}
      </h3>

      <div className="mt-auto flex items-center justify-between text-gray-500 text-[11px] sm:text-xs font-medium pt-4 sm:pt-5 border-t border-gray-100">
        <div>
          By <span className="text-gray-900">{post.author}</span>
          <span className="mx-1.5 sm:mx-2">•</span>
          {new Date(post.displayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <ArrowRightIcon className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  </div>
);

// Sub-component: Editorial-shaped loading skeleton (mirrors real layout instead of a blank spinner)
const ImpactPulseSkeleton = () => (
  <div className="min-h-screen bg-[#FDFCFB] pb-24 animate-pulse">
    <header className="pt-32 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-12 sm:h-14 w-64 sm:w-72 bg-gray-200 rounded-2xl mb-8" />
        <div className="h-40 sm:h-16 w-full max-w-3xl bg-gray-100 rounded-2xl sm:rounded-full" />
      </div>
    </header>
    <main className="max-w-7xl mx-auto px-6 pt-10">
      <div className="w-full aspect-square sm:aspect-[2.5/1] bg-gray-200 rounded-[2rem] mb-12 sm:mb-16" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 sm:gap-y-16">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="w-full aspect-[4/3] bg-gray-200 rounded-2xl mb-4 sm:mb-6" />
            <div className="h-2 sm:h-3 w-24 bg-gray-200 rounded-full mb-3 sm:mb-4" />
            <div className="h-5 sm:h-6 w-full bg-gray-200 rounded-lg mb-2" />
            <div className="h-5 sm:h-6 w-3/4 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>
    </main>
  </div>
);

// Sub-component: Empty state
const EmptyState = () => (
  <div className="py-24 flex flex-col items-center text-center px-4">
    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4 sm:mb-5">
      <SearchXIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
    </div>
    <h3 className="text-lg sm:text-xl text-gray-500 font-heading font-bold mb-1">No publications match your filter.</h3>
    <p className="text-xs sm:text-sm text-gray-400">Try a different category or format.</p>
  </div>
);