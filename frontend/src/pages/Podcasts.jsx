import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Pure SVGs for Platforms
const YouTubeLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const SpotifyLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.3 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.781s.18-1.2.78-1.381c4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.239.54-.959.72-1.62.36z"/>
  </svg>
);

export default function Podcasts() {
  const [episodes, setEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set the browser title bar
    document.title = "Podcasts | Friends from Afrika 4 Afrika";

    const fetchPodcasts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/content/podcasts/');
        const data = await response.json();
        
        const now = new Date();
        const liveEpisodes = data.filter(ep => ep.is_published && new Date(ep.published_date) <= now);
        
        liveEpisodes.sort((a, b) => new Date(b.published_date) - new Date(a.published_date));
        
        setEpisodes(liveEpisodes);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  // NEW: Force scroll to top ONLY after the content finishes loading
  useEffect(() => {
    if (!isLoading) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const featured = episodes.find(ep => ep.is_featured) || episodes[0];
  const restEpisodes = featured ? episodes.filter(ep => ep.id !== featured.id) : [];

  return (
    <div className="bg-white min-h-screen pb-32">
      
      {/* Featured Section (Hero) */}
      <section className="pt-24 pb-20 px-6 bg-orange-50/30 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-16 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 w-full">
              <h1 className="text-5xl md:text-7xl font-heading font-black text-primary leading-tight">
                Friends from Afrika <br/><span className="text-secondary">4 Afrika.</span>
              </h1>
              
              {/* External Platform Links - Pushed right, made larger, no backgrounds */}
              <div className="flex items-center justify-end gap-6 md:mb-3 md:ml-auto">
                <a 
                  href="https://www.youtube.com/@RafikiAfrik" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[#FF0000] hover:scale-110 hover:drop-shadow-lg hover:opacity-80 transition-all duration-300"
                  title="Watch on YouTube"
                >
                  <YouTubeLogo className="w-10 h-10 md:w-12 md:h-12" />
                </a>
                <a 
                  href="https://open.spotify.com/show/7aHqkVVrlFcihnO9wnu7Nu?si=cJ-CU0KUQjedxrNQRF0g8A&utm_source=whatsapp" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[#1DB954] hover:scale-110 hover:drop-shadow-lg hover:opacity-80 transition-all duration-300"
                  title="Listen on Spotify"
                >
                  <SpotifyLogo className="w-10 h-10 md:w-12 md:h-12" />
                </a>
              </div>
            </div>
            
            <p className="text-xl text-gray-600 font-medium max-w-3xl">
              Exclusive panels, off-the-record Q&As, and discussions with industry leaders across the continent.
            </p>
          </div>

          {featured ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              
              {/* Static Image Linking to Inner Page */}
              <Link 
                to={`/podcasts/${featured.slug}`} 
                className="lg:col-span-8 w-full aspect-video bg-gray-100 rounded-3xl overflow-hidden shadow-xl shadow-primary/5 block group border border-gray-200/50"
              >
                <img 
                  src={`https://img.youtube.com/vi/${getYouTubeId(featured.embed_url)}/maxresdefault.jpg`}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => { e.target.src = `https://img.youtube.com/vi/${getYouTubeId(featured.embed_url)}/hqdefault.jpg`; }}
                />
              </Link>
              
              <div className="lg:col-span-4 flex flex-col justify-center">
                <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-4 border-b border-secondary/20 pb-4 inline-block w-fit">
                  Latest Episode
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-heading font-black text-primary mb-6 leading-tight">
                  {featured.title}
                </h2>
                
                <div 
                  className="text-gray-600 prose prose-sm max-w-none line-clamp-4 leading-relaxed mb-8"
                  dangerouslySetInnerHTML={{ __html: featured.description }}
                />

                <div className="flex items-center justify-between mt-auto">
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {new Date(featured.published_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <Link 
                    to={`/podcasts/${featured.slug}`} 
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors"
                  >
                    Listen Now <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          ) : (
            <div className="py-20 text-gray-500 font-medium">
              No episodes available yet. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* Library Grid - Clean Editorial Layout */}
      {restEpisodes.length > 0 && (
        <section className="pt-32 px-6">
          <div className="max-w-7xl mx-auto">
            
            <div className="flex items-end justify-between mb-20">
              <h3 className="text-4xl md:text-5xl font-heading font-black text-primary">
                The Library.
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
              {restEpisodes.map(episode => {
                const videoId = getYouTubeId(episode.embed_url);
                const highResThumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                const fallbackThumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

                return (
                  <Link 
                    key={episode.id} 
                    to={`/podcasts/${episode.slug}`} 
                    className="group flex flex-col"
                  >
                    {/* Unboxed Image (No Play Overlay) */}
                    <div className="aspect-[16/9] bg-gray-100 rounded-2xl overflow-hidden mb-8 relative border border-gray-100">
                      <img 
                        src={highResThumb} 
                        alt={episode.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={(e) => { e.target.src = fallbackThumb; }}
                      />
                    </div>
                    
                    {/* Typography-led Content */}
                    <div className="flex flex-col flex-grow">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                        {new Date(episode.published_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                      
                      <h4 className="text-2xl lg:text-3xl font-heading font-black text-primary mb-5 leading-tight group-hover:text-secondary transition-colors">
                        {episode.title}
                      </h4>
                      
                      {/* Description removed for cleaner UI */}
                      
                      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary group-hover:opacity-80 transition-opacity mt-auto">
                        Listen <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        </section>
      )}
    </div>
  );
}