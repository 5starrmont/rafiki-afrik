import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export default function PodcastFeed() {
  const [latestEpisode, setLatestEpisode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/content/podcasts/');
        const data = await response.json();
        
        const now = new Date();
        const liveEpisodes = data.filter(ep => ep.is_published && new Date(ep.published_date) <= now);
        
        liveEpisodes.sort((a, b) => new Date(b.published_date) - new Date(a.published_date));
        
        if (liveEpisodes.length > 0) {
          setLatestEpisode(liveEpisodes[0]);
        }
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  if (isLoading || !latestEpisode) return null; 

  const videoIdMatch = latestEpisode.embed_url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  const videoId = (videoIdMatch && videoIdMatch[2].length === 11) ? videoIdMatch[2] : '';
  const highResThumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackThumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <section className="py-24 px-6 bg-orange-50/30 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section (Scaled up to match the Podcasts hero) */}
        <div className="mb-16 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 w-full">
            <h2 className="text-5xl md:text-7xl font-heading font-black text-primary leading-tight">
              Latest <br/><span className="text-secondary">Conversation.</span>
            </h2>
            
            <div className="hidden md:flex items-center justify-end gap-6 md:mb-3 md:ml-auto">
              <Link 
                to="/podcasts" 
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors group"
              >
                Explore Library <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          <p className="text-xl text-gray-600 font-medium max-w-3xl">
            Tune into the Friends from Afrika 4 Afrika podcast. Exclusive panels, off-the-record Q&As, and discussions with industry leaders.
          </p>
        </div>

        {/* Hero Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Static Image Linking to Inner Page */}
          <Link 
            to={`/podcasts/${latestEpisode.slug}`} 
            className="lg:col-span-8 w-full aspect-video bg-gray-100 rounded-3xl overflow-hidden shadow-xl shadow-primary/5 block group border border-gray-200/50"
          >
            <img 
              src={highResThumb}
              alt={latestEpisode.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={(e) => { e.target.src = fallbackThumb; }}
            />
          </Link>
          
          {/* Typography Content Side */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-4 border-b border-secondary/20 pb-4 inline-block w-fit">
              Latest Episode
            </div>
            
            <h3 className="text-3xl lg:text-4xl font-heading font-black text-primary mb-6 leading-tight">
              {latestEpisode.title}
            </h3>
            
            <div 
              className="text-gray-600 prose prose-sm max-w-none line-clamp-4 leading-relaxed mb-8"
              dangerouslySetInnerHTML={{ __html: latestEpisode.description }}
            />

            <div className="flex items-center justify-between mt-auto">
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {new Date(latestEpisode.published_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <Link 
                to={`/podcasts/${latestEpisode.slug}`} 
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors"
              >
                Listen Now <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* Mobile View All Button */}
        <div className="mt-12 md:hidden text-center">
          <Link 
            to="/podcasts" 
            className="inline-flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors group"
          >
            Explore Library <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}