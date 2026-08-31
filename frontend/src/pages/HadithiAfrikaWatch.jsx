import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { contentAPI } from '../services/api';

// SVGs
const PlayIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
);
const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const InfoIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);
const CloseIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ExternalLinkIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);
const ShareIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);
const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const FilmIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <rect x="2.5" y="4.5" width="19" height="15" rx="1.5" />
    <line x1="7" y1="4.5" x2="7" y2="19.5" strokeDasharray="1.5 2" />
    <line x1="17" y1="4.5" x2="17" y2="19.5" strokeDasharray="1.5 2" />
  </svg>
);

// Social Icons
const WhatsAppIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);
const TwitterIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const LinkedInIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);
const FacebookIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.37 14.5 5 15.5 5H18V0h-3.808C10.59 0 9 1.581 9 4.475V8z"/>
  </svg>
);

const GRAIN_SVG = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
)}`;

// Helper to safely extract YouTube embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  } else if (url.includes('watch?v=')) {
    videoId = url.split('watch?v=')[1]?.split('&')[0];
  } else if (url.includes('embed/')) {
    videoId = url.split('embed/')[1]?.split('?')[0];
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url;
};

// Generates a short, highly random alphanumeric string from a combination of text and ID
const generateHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

// Helper to create a fully random-looking, SEO-friendly obfuscated URL slug
const createSlug = (title, id) => {
  const cleanTitle = (title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const uniqueHash = generateHash(`${id}-${title}-ha2026`);
  return `${cleanTitle}-${uniqueHash}`;
};

export default function HadithiAfrikaWatch() {
  const [films, setFilms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Read URL parameters
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const selectedYear = searchParams.get('year') || '';
  const sharedFilmSlug = searchParams.get('film'); // Detect shared obfuscated slug

  // Modal State & Active Playing State
  const [infoModalFilm, setInfoModalFilm] = useState(null);
  const [playingFilm, setPlayingFilm] = useState(null);

  useEffect(() => {
    document.title = "Watch | Hadithi Afrika";

    const fetchPublicFilms = async () => {
      try {
        const response = await contentAPI.getFilms();

        const now = new Date();
        const liveFilms = response.data.filter(film => {
          const postDate = new Date(film.published_date);
          return film.is_published === true && postDate <= now;
        });

        const sortedFilms = liveFilms.sort((a, b) => new Date(b.published_date) - new Date(a.published_date));
        setFilms(sortedFilms);

        // Auto-open modal if an obfuscated film slug was shared in the URL
        if (sharedFilmSlug) {
          const filmToOpen = sortedFilms.find(f => createSlug(f.title, f.id) === sharedFilmSlug);
          if (filmToOpen) {
            setInfoModalFilm(filmToOpen);
          }
        }
      } catch (error) {
        console.error("Error fetching public films:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicFilms();
  }, [sharedFilmSlug]);

  // Cleanly close the modal and wipe the ?film= param from the URL
  const closeModalAndCleanUrl = () => {
    setInfoModalFilm(null);
    setShowShareMenu(false);

    if (searchParams.has('film')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('film');
      setSearchParams(newParams, { replace: true });
    }
  };

  const getSiteShareUrl = (film) => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?film=${createSlug(film.title, film.id)}`;
  };

  const handleCopyLink = (film) => {
    const shareUrl = getSiteShareUrl(film);
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setShowShareMenu(false);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSocialShare = (platform, film) => {
    const rawUrl = getSiteShareUrl(film);
    const title = `Watch "${film.title}" on Hadithi Afrika`;
    
    let url = '';
    if (platform === 'whatsapp') {
      // Encode entire string with a line break to ensure WhatsApp parses the URL properly
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n\n${rawUrl}`)}`;
    } else if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(rawUrl)}`;
    } else if (platform === 'linkedin') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(rawUrl)}`;
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(rawUrl)}`;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  // Filtering Logic
  const isFiltering = searchQuery.trim().length > 0 || selectedYear !== '';

  const filteredFilms = films.filter(film => {
    const matchesSearch = searchQuery.trim() === '' || film.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = selectedYear === '' || String(film.release_year) === String(selectedYear);
    return matchesSearch && matchesYear;
  });

  const featuredFilm = !isFiltering && films.length > 0 ? films[0] : null;
  const catalogFilms = isFiltering ? filteredFilms : (films.length > 1 ? films.slice(1) : []);
  const hasCatalog = films.length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
          <div className="absolute inset-0 rounded-full border-2 border-secondary border-t-transparent animate-spin"></div>
        </div>
        <span className="font-body text-[11px] uppercase tracking-[0.3em] text-white/30">Loading Catalog</span>
      </div>
    );
  }

  // --- NETFLIX-STYLE EMBEDDED PLAYER VIEW ---
  if (playingFilm) {
    return (
      <div className="fixed inset-0 z-[300] bg-black flex flex-col justify-between overflow-hidden animate-in fade-in duration-300">
        
        {/* Top Control Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-12 py-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent">
          <button 
            onClick={() => setPlayingFilm(null)}
            className="flex items-center gap-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md transition-all font-heading font-bold text-sm cursor-pointer"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Browse
          </button>

          <div className="flex items-center gap-4">
            <span className="font-heading font-bold text-white tracking-wide text-sm md:text-base hidden sm:inline-block">
              {playingFilm.title}
            </span>
            {playingFilm.video_url && (
              <a 
                href={playingFilm.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs md:text-sm font-heading font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md transition-all"
                title="Open directly in YouTube"
              >
                <span>YouTube</span>
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Video Iframe Container */}
        <div className="w-full h-full flex items-center justify-center relative">
          <iframe 
            src={getYouTubeEmbedUrl(playingFilm.video_url)} 
            title={playingFilm.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-primary min-h-screen text-white font-body selection:bg-secondary selection:text-white pb-24 overflow-x-hidden">

      <style>{`
        @keyframes hadithiRise {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hadithi-rise {
          opacity: 0;
          animation: hadithiRise 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hadithi-rise-1 { animation-delay: 0.05s; }
        .hadithi-rise-2 { animation-delay: 0.18s; }
        .hadithi-rise-3 { animation-delay: 0.32s; }
        .hadithi-rise-4 { animation-delay: 0.46s; }

        .hadithi-grain {
          background-image: url("${GRAIN_SVG}");
          background-size: 140px 140px;
          mix-blend-mode: overlay;
        }

        .hadithi-scroll::-webkit-scrollbar { width: 6px; }
        .hadithi-scroll::-webkit-scrollbar-track { background: transparent; }
        .hadithi-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(255,255,255,0.15);
          border-radius: 999px;
        }
        .hadithi-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.15) transparent; }
      `}</style>

      {/* Ambient grain overlay */}
      <div className="hadithi-grain pointer-events-none fixed inset-0 z-40 opacity-[0.035]"></div>

      {/* Hero Section (Hidden when actively filtering) */}
      {!isFiltering && featuredFilm ? (
        <div className="relative w-full h-[76vh] min-h-[560px] flex flex-col justify-end px-6 md:px-12 pb-14">

          {/* Background Image & Gradients */}
          <div className="absolute inset-0 w-full h-full z-0">
            {featuredFilm.poster_image ? (
              <img
                src={featuredFilm.poster_image}
                alt={featuredFilm.title}
                className="w-full h-full object-cover object-top opacity-80"
              />
            ) : (
              <div className="w-full h-full bg-primary"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/45 to-transparent w-full md:w-[85%]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/55 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-transparent to-transparent h-40"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-3xl">
            <div className="hadithi-rise hadithi-rise-1 flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-secondary"></span>
              <span className="text-secondary font-heading font-black tracking-[0.3em] uppercase text-[11px]">
                {featuredFilm.is_featured ? 'Hadithi Original' : 'Featured Film'}
              </span>
            </div>

            <h1 className="hadithi-rise hadithi-rise-2 text-5xl md:text-7xl lg:text-8xl font-heading font-black text-white leading-[0.92] tracking-tight mb-4 drop-shadow-2xl uppercase">
              {featuredFilm.title}
            </h1>

            {/* Release Year, Production Tag, & Streaming Badge */}
            <div className="hadithi-rise hadithi-rise-2 flex flex-col gap-1.5 mb-6">
              <div className="flex items-center gap-3 text-white/60 text-xs font-bold tracking-widest uppercase">
                {featuredFilm.release_year && <span>{featuredFilm.release_year}</span>}
                {featuredFilm.release_year && <span className="w-1 h-1 rounded-full bg-white/30"></span>}
                <span className="text-secondary">A Hadithi Afrika Production</span>
              </div>
              <div className="text-white/40 text-[11px] font-bold tracking-[0.2em] uppercase">
                Now Streaming
              </div>
            </div>

            <div
              className="hadithi-rise hadithi-rise-3 text-white/90 text-base md:text-lg leading-relaxed mb-8 line-clamp-3 md:line-clamp-4 drop-shadow-md max-w-2xl"
              dangerouslySetInnerHTML={{ __html: featuredFilm.description }}
            />

            <div className="hadithi-rise hadithi-rise-4 flex items-center gap-4">
              {featuredFilm.video_url ? (
                <button
                  onClick={() => setPlayingFilm(featuredFilm)}
                  aria-label={`Play ${featuredFilm.title}`}
                  className="group flex items-center justify-center bg-secondary hover:bg-white text-white hover:text-primary font-heading font-black uppercase tracking-widest py-3.5 px-10 rounded-full shadow-xl shadow-black/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-sm md:text-base cursor-pointer"
                >
                  <PlayIcon className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                  Play
                </button>
              ) : (
                <button disabled className="flex items-center justify-center bg-white/10 border border-white/20 text-white/50 font-heading font-bold uppercase tracking-widest py-3.5 px-10 rounded-full cursor-not-allowed text-sm md:text-base">
                  Coming Soon
                </button>
              )}

              <button
                onClick={() => setInfoModalFilm(featuredFilm)}
                aria-label={`More info about ${featuredFilm.title}`}
                title="More Info"
                className="flex items-center justify-center w-14 h-14 bg-white/10 hover:bg-white/25 border border-white/20 text-white rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-md cursor-pointer"
              >
                <InfoIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        isFiltering && <div className="pt-32"></div>
      )}

      {/* Empty catalog state */}
      {!hasCatalog && (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
          <FilmIcon className="w-14 h-14 text-white/15 mb-6" />
          <h2 className="font-heading font-black uppercase text-2xl md:text-3xl text-white/80 mb-3">The Screen Is Dark</h2>
          <p className="text-white/40 max-w-sm">Nothing has premiered here yet. New stories are on their way — check back soon.</p>
        </div>
      )}

      {/* Film Grid Area */}
      {hasCatalog && (
        <div className="relative z-20 px-6 md:px-12">

          {isFiltering ? (
            <div className="mb-8">
              <h3 className="text-xl md:text-2xl font-heading font-bold text-white uppercase tracking-wide">
                Filter Results
              </h3>
              <p className="text-white/40 text-sm mt-1">
                Showing {catalogFilms.length} title{catalogFilms.length === 1 ? '' : 's'} 
                {searchQuery ? ` matching "${searchQuery}"` : ''} 
                {selectedYear ? ` from ${selectedYear}` : ''}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-secondary"></div>
                <h3 className="text-xl md:text-2xl font-heading font-bold text-white uppercase tracking-wide">
                  The Cinematic Collection
                </h3>
              </div>
              <div className="flex items-center gap-1.5 opacity-60">
                <div className="w-10 h-[2px] bg-white/30 rounded-full"></div>
                <div className="w-4 h-[2px] bg-secondary rounded-full"></div>
              </div>
            </div>
          )}

          {catalogFilms.length === 0 && isFiltering ? (
            <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
              <SearchIcon className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 font-medium">No films found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
              {catalogFilms.map((film) => (
                <div
                  key={film.id}
                  className="group cursor-pointer flex flex-col"
                  onClick={() => setInfoModalFilm(film)}
                >
                  {/* Poster Image with Hover Overlay */}
                  <div className="aspect-[2/3] rounded-xl overflow-hidden bg-primary/80 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:shadow-black/50 border border-white/10 group-hover:border-secondary/70 mb-4 relative">
                    {film.poster_image ? (
                      <img
                        src={film.poster_image}
                        alt={film.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30 text-xs text-center p-4">
                        {film.title}
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>

                    {film.is_featured && (
                      <span className="absolute top-2.5 left-2.5 bg-secondary/95 text-white text-[9px] font-heading font-black uppercase tracking-widest px-2 py-1 rounded-md backdrop-blur-sm">
                        Original
                      </span>
                    )}

                    {/* Dark overlay with interactive buttons on hover */}
                    <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">

                      {film.video_url && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlayingFilm(film);
                          }}
                          aria-label={`Play ${film.title}`}
                          title="Play Film"
                          className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center hover:bg-white hover:text-primary transition-colors shadow-lg cursor-pointer"
                        >
                          <PlayIcon className="w-5 h-5 ml-1" />
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInfoModalFilm(film);
                        }}
                        aria-label={`More info about ${film.title}`}
                        title="More Info"
                        className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white hover:text-primary transition-colors shadow-lg backdrop-blur-md cursor-pointer"
                      >
                        <InfoIcon className="w-6 h-6" />
                      </button>

                    </div>
                  </div>

                  {/* Title & Info Below Image */}
                  <div className="flex flex-col px-1">
                    <h4 className="text-white font-heading font-bold text-sm md:text-base leading-tight transition-all duration-300 group-hover:text-secondary group-hover:drop-shadow-[0_0_8px_rgba(255,107,0,0.8)] line-clamp-2">
                      {film.title}
                    </h4>
                    <span className="text-xs font-bold tracking-widest uppercase text-white/50 mt-1">
                      {film.release_year || 'TBA'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info Pop-Up Modal */}
      {infoModalFilm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-primary/90 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={closeModalAndCleanUrl}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-primary border border-white/10 rounded-3xl w-full max-w-4xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

            <button
              onClick={closeModalAndCleanUrl}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-md border border-white/10 cursor-pointer"
            >
              <CloseIcon className="w-5 h-5" />
            </button>

            {/* Left/Top: Image Container */}
            <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-primary/80 flex-shrink-0">
              {infoModalFilm.poster_image ? (
                <img
                  src={infoModalFilm.poster_image}
                  alt={infoModalFilm.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/30">
                  No Poster
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary to-transparent md:hidden"></div>
              <div className="hidden md:block absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent to-primary"></div>
            </div>

            {/* Right/Bottom: Info & Actions */}
            <div className="hadithi-scroll w-full md:w-3/5 p-8 md:p-10 lg:p-12 overflow-y-auto flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                {infoModalFilm.is_featured && (
                  <span className="text-secondary font-heading font-black tracking-widest uppercase text-[10px]">
                    Hadithi Original
                  </span>
                )}
                <span className="text-white/50 font-bold tracking-widest uppercase text-[10px]">
                  {infoModalFilm.release_year || 'TBA'}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-heading font-black text-white mb-6 uppercase leading-[0.95] drop-shadow-md">
                {infoModalFilm.title}
              </h2>

              <div
                className="text-white/80 text-sm md:text-base leading-relaxed mb-8 flex-grow prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: infoModalFilm.description }}
              />

              <div className="mt-auto pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 relative">
                {infoModalFilm.video_url ? (
                  <button
                    onClick={() => {
                      closeModalAndCleanUrl();
                      setPlayingFilm(infoModalFilm);
                    }}
                    className="group inline-flex items-center justify-center bg-secondary hover:bg-white hover:text-primary text-white font-heading font-bold uppercase tracking-widest py-3.5 px-10 rounded-full transition-colors shadow-lg hover:-translate-y-0.5 cursor-pointer"
                  >
                    <PlayIcon className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                    Play Film
                  </button>
                ) : (
                  <div className="inline-flex items-center justify-center w-full sm:w-auto bg-white/10 border border-white/20 text-white/50 font-heading font-bold uppercase tracking-widest py-3.5 px-10 rounded-full cursor-not-allowed">
                    Coming Soon
                  </div>
                )}

                {/* Share Button & Dropdown Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-widest text-white/80 hover:text-white px-5 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all cursor-pointer backdrop-blur-md"
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Link Copied</span>
                      </>
                    ) : (
                      <>
                        <ShareIcon className="w-4 h-4" />
                        <span>Share</span>
                      </>
                    )}
                  </button>

                  {/* Social Share Options Dropdown - Positioned ABOVE the button to not cover modal details */}
                  {showShareMenu && (
                    <div className="absolute left-0 sm:left-auto sm:right-0 bottom-full mb-3 w-56 bg-primary/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-xl p-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 border-b border-white/10 mb-1">
                        Share Film Link
                      </div>
                      
                      <button
                        onClick={() => handleCopyLink(infoModalFilm)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-left"
                      >
                        <span>Copy Link</span>
                        <ShareIcon className="w-3.5 h-3.5 text-white/50" />
                      </button>

                      <button
                        onClick={() => handleSocialShare('whatsapp', infoModalFilm)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-left"
                      >
                        <span className="flex items-center gap-2">
                          <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                          <span>WhatsApp</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase">Chat</span>
                      </button>

                      <button
                        onClick={() => handleSocialShare('twitter', infoModalFilm)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-left"
                      >
                        <span className="flex items-center gap-2">
                          <TwitterIcon className="w-4 h-4 text-white" />
                          <span>X (Twitter)</span>
                        </span>
                        <span className="text-[10px] text-sky-400 font-bold uppercase">Tweet</span>
                      </button>

                      <button
                        onClick={() => handleSocialShare('linkedin', infoModalFilm)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-left"
                      >
                        <span className="flex items-center gap-2">
                          <LinkedInIcon className="w-4 h-4 text-blue-400" />
                          <span>LinkedIn</span>
                        </span>
                        <span className="text-[10px] text-blue-400 font-bold uppercase">Post</span>
                      </button>

                      <button
                        onClick={() => handleSocialShare('facebook', infoModalFilm)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-left"
                      >
                        <span className="flex items-center gap-2">
                          <FacebookIcon className="w-4 h-4 text-blue-500" />
                          <span>Facebook</span>
                        </span>
                        <span className="text-[10px] text-blue-500 font-bold uppercase">Share</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}