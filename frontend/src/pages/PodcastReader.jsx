import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Pause, Video, Headphones, Rewind, FastForward, ChevronDown, Loader2 } from 'lucide-react';

// YouTube ID Extractor
const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
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

// High-Fidelity Gradient Waveform Background (Hidden on Mobile)
const BackgroundVisualizer = ({ isPlaying, mode }) => {
  const [heights, setHeights] = useState(Array(24).fill(10));

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setHeights(Array(24).fill(0).map(() => Math.floor(Math.random() * 65) + 15));
      }, 150);
    } else {
      setHeights(Array(24).fill(5));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (mode !== 'audio') return null;

  return (
    <div className="hidden md:flex absolute inset-0 z-0 items-end justify-center gap-2 md:gap-4 opacity-[0.06] pointer-events-none overflow-hidden pb-20">
      {heights.map((h, i) => (
        <div 
          key={i} 
          className="w-8 md:w-16 bg-gradient-to-t from-primary to-secondary rounded-t-full transition-all duration-200 ease-out" 
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
};

export default function PodcastReader() {
  const { id: slug } = useParams();

  const [episode, setEpisode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [mode, setMode] = useState('audio');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPending, setIsPending] = useState(false); // Added pending state
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const iframeRef = useRef(null);
  const detailsRef = useRef(null);
  const originUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/content/podcasts/${slug}/`);
        if (!response.ok) throw new Error('Episode not found');
        const data = await response.json();
        setEpisode(data);
        
        document.title = `${data.title} | Friends from Afrika 4 Afrika`;
      } catch (error) {
        console.error("Error fetching episode:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEpisode();
  }, [slug]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== 'https://www.youtube.com') return;
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'infoDelivery' && data.info) {
          if (data.info.currentTime !== undefined) setCurrentTime(data.info.currentTime);
          if (data.info.duration !== undefined) setDuration(data.info.duration);
          
          // Updated to handle buffering/pending state mapping
          if (data.info.playerState !== undefined) {
            const state = data.info.playerState;
            if (state === 1) { // Playing
              setIsPlaying(true);
              setIsPending(false);
            } else if (state === 2 || state === 0) { // Paused or Ended
              setIsPlaying(false);
              setIsPending(false);
            } else if (state === 3) { // Buffering
              setIsPending(true);
            }
          }
        }
      } catch (e) {}
    };
    
    window.addEventListener('message', handleMessage);
    
    const interval = setInterval(() => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), '*');
      }
    }, 1000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(interval);
    };
  }, []);

  const togglePlay = () => {
    if (iframeRef.current) {
      setIsPending(true); // Trigger immediate UI feedback
      const command = isPlaying ? 'pauseVideo' : 'playVideo';
      iframeRef.current.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: command,
        args: []
      }), '*');
    }
  };

  const seekToTime = (newTime) => {
    setCurrentTime(newTime);
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'seekTo',
        args: [newTime, true]
      }), '*');
    }
  };

  const handleSeekDrag = (e) => {
    seekToTime(parseFloat(e.target.value));
  };

  const skipForward = () => {
    seekToTime(Math.min(duration, currentTime + 10));
  };

  const skipBackward = () => {
    seekToTime(Math.max(0, currentTime - 10));
  };

  const scrollToDetails = () => {
    if (detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white md:bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!episode) return null;

  const videoId = getYouTubeId(episode.embed_url);
  const highResThumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackThumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const progressPercent = (currentTime / (duration || 1)) * 100;

  return (
    <div className="min-h-screen bg-white md:bg-gradient-to-br from-[#FDFDFD] via-white to-[#F7F7F7] flex flex-col justify-between selection:bg-secondary/20 selection:text-primary">
      
      {/* IMMERSIVE PLAYER VIEW */}
      <div className="relative min-h-[90vh] flex flex-col items-center justify-start md:justify-center pt-20 md:pt-32 pb-16 w-full">
        
        {/* Dynamic Background */}
        <BackgroundVisualizer isPlaying={isPlaying} mode={mode} />

        <div className="max-w-4xl mx-auto px-0 md:px-6 w-full relative z-10 flex flex-col items-center text-center">

          {/* 1. PREMIUM MEDIA & CONTROLS DECK */}
          <div className="w-full bg-white md:p-6 md:rounded-[2.5rem] md:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] md:border border-gray-100/80">
            
            {/* Edge-to-Edge on Mobile, Rounded Card on Desktop */}
            <div className="relative w-full aspect-video bg-black rounded-none md:rounded-3xl overflow-hidden flex items-center justify-center mb-8 md:shadow-inner">
              
              {/* Video Mode Frame */}
              <div className={`absolute inset-0 w-full h-full z-20 bg-black transition-opacity duration-500 ${mode === 'video' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <iframe 
                  ref={iframeRef}
                  src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&rel=0&origin=${originUrl}`} 
                  title={episode.title}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Audio Mode Thumb */}
              <div className={`absolute inset-0 w-full h-full z-10 bg-black transition-opacity duration-700 ${mode === 'audio' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <img 
                  src={highResThumb} 
                  alt={episode.title} 
                  className={`w-full h-full object-cover transition-transform duration-[30s] ease-linear ${isPlaying ? 'scale-110' : 'scale-100'}`}
                  onError={(e) => { e.target.src = fallbackThumb; }}
                />
              </div>
            </div>

            {/* 2. SEEK BAR */}
            <div className="mb-8 px-6 md:px-2">
              <div className="relative w-full h-2 rounded-full group/seek cursor-pointer flex items-center bg-gray-100">
                
                <div 
                  className="absolute top-0 left-0 h-full bg-primary rounded-full pointer-events-none transition-all duration-100"
                  style={{ width: `${progressPercent}%` }}
                ></div>
                
                <div 
                  className="absolute h-4 w-4 bg-secondary rounded-full shadow-[0_0_15px_rgba(234,88,12,0.6)] scale-0 group-hover/seek:scale-100 transition-transform duration-150 pointer-events-none -ml-2"
                  style={{ left: `${progressPercent}%` }}
                ></div>

                <input 
                  type="range" 
                  min="0" 
                  max={duration || 100} 
                  value={currentTime} 
                  onChange={handleSeekDrag}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
              </div>
              
              <div className="flex justify-between items-center text-[11px] font-bold font-mono tracking-wider mt-3 text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* 3. CONTROLS & PLATFORM LINKS */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6 px-6 md:px-2 pb-6 md:pb-2">
              
              {/* Toggle Group */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start order-2 md:order-1">
                {/* Fluid Pill Toggle for Audio/Video */}
                <div className="relative flex items-center p-1 rounded-full bg-gray-100 border border-gray-200/50">
                  <div 
                    className="absolute left-1 top-1 bottom-1 w-12 md:w-14 bg-white rounded-full shadow-sm transition-transform duration-300 ease-out"
                    style={{ transform: mode === 'video' ? 'translateX(100%)' : 'translateX(0)' }}
                  ></div>
                  
                  <button 
                    onClick={() => setMode('audio')}
                    className={`relative z-10 w-12 h-10 md:w-14 md:h-12 flex items-center justify-center transition-colors duration-300 ${mode === 'audio' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                    title="Audio Mode"
                  >
                    <Headphones className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setMode('video')}
                    className={`relative z-10 w-12 h-10 md:w-14 md:h-12 flex items-center justify-center transition-colors duration-300 ${mode === 'video' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                    title="Video Mode"
                  >
                    <Video className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Playback Controls */}
              <div className="flex items-center gap-8 md:gap-6 order-1 md:order-2">
                <button 
                  onClick={skipBackward}
                  className="p-2 md:p-3 rounded-full transition-all active:scale-90 text-gray-400 hover:text-primary hover:bg-gray-50"
                  title="Skip back 10 seconds"
                >
                  <Rewind className="w-8 h-8 md:w-6 md:h-6" fill="currentColor" />
                </button>
                
                <div className="relative">
                  {isPlaying && !isPending && (
                    <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-20"></div>
                  )}
                  {/* Updated Play/Pause button with loading state */}
                  <button 
                    onClick={togglePlay}
                    disabled={isPending}
                    className={`relative w-20 h-20 md:w-16 md:h-16 rounded-full text-white flex items-center justify-center transition-all duration-200 ${
                      isPending 
                        ? 'scale-95 bg-primary/90 shadow-[inset_0_4px_10px_rgba(0,0,0,0.2)]' 
                        : 'active:scale-95 bg-primary hover:bg-secondary shadow-xl shadow-primary/20 hover:shadow-secondary/30'
                    }`}
                  >
                    {isPending ? (
                      <Loader2 className="w-8 h-8 md:w-7 md:h-7 animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="w-8 h-8 md:w-7 md:h-7" fill="currentColor" />
                    ) : (
                      <Play className="w-8 h-8 md:w-7 md:h-7 ml-1" fill="currentColor" />
                    )}
                  </button>
                </div>
                
                <button 
                  onClick={skipForward}
                  className="p-2 md:p-3 rounded-full transition-all active:scale-90 text-gray-400 hover:text-primary hover:bg-gray-50"
                  title="Skip forward 10 seconds"
                >
                  <FastForward className="w-8 h-8 md:w-6 md:h-6" fill="currentColor" />
                </button>
              </div>

              {/* External Links */}
              <div className="flex items-center justify-center gap-4 w-full md:w-auto flex-shrink-0 order-3">
                <a 
                  href={episode.embed_url} 
                  target="_blank" 
                  rel="noreferrer"
                  title="Watch on YouTube"
                  className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 border border-gray-200/80 rounded-full transition-all duration-300 bg-white text-[#FF0000] hover:border-[#FF0000] hover:bg-red-50/50 hover:shadow-sm"
                >
                  <YouTubeLogo className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                
                {episode.spotify_url ? (
                  <a 
                    href={episode.spotify_url} 
                    target="_blank" 
                    rel="noreferrer"
                    title="Listen on Spotify"
                    className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 border border-gray-200/80 rounded-full transition-all duration-300 bg-white text-[#1DB954] hover:border-[#1DB954] hover:bg-[#1DB954]/10 hover:shadow-sm"
                  >
                    <SpotifyLogo className="w-5 h-5 md:w-6 md:h-6" />
                  </a>
                ) : (
                  <button 
                    disabled
                    title="Listen on Spotify (Not available)"
                    className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 border border-gray-200/80 rounded-full cursor-not-allowed transition-all duration-300 bg-white/50 text-[#1DB954] opacity-50"
                  >
                    <SpotifyLogo className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Scroll Down Indicator */}
          <div className="mt-8 md:mt-12 flex justify-center pb-8 md:pb-0">
            <button 
              onClick={scrollToDetails}
              className="flex flex-col items-center gap-2 text-gray-400 hover:text-primary transition-colors group cursor-pointer"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 group-hover:opacity-100 transition-opacity">Discover More</span>
              <div className="p-2 rounded-full bg-white border border-gray-100 shadow-sm group-hover:border-secondary transition-colors">
                <ChevronDown className="w-4 h-4 animate-bounce text-gray-400 group-hover:text-secondary" />
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* 4. DETAILS & EPISODE NOTES SECTION */}
      <div ref={detailsRef} className="bg-white border-t border-gray-100 py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          
          {/* Editorial Header (Moved here) */}
          <div className="mb-16 text-left">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest mb-6">
              {new Date(episode.published_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black leading-[1.1] text-primary tracking-tight">
              {episode.title}
            </h1>
          </div>

          <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-10 flex items-center gap-4 text-gray-400 before:h-px before:flex-1 before:bg-gray-100 after:h-px after:flex-1 after:bg-gray-100">
            Episode Notes
          </h3>
          
          <div 
            className="prose prose-base md:prose-lg max-w-none prose-a:transition-colors prose-p:leading-relaxed text-gray-600 prose-headings:font-heading prose-headings:font-black prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-primary marker:text-secondary"
            dangerouslySetInnerHTML={{ __html: episode.description }}
          />
        </div>
      </div>

    </div>
  );
}