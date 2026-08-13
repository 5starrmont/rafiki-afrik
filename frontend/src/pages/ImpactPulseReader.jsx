import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Link2 } from 'lucide-react';

// Sleek, ultra-minimalist back arrow
const MinimalBackIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
);
const LinkedinIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
);
const FacebookIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
);
const WhatsAppIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
);
// Smooth Play Icon
const PlayIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6.5 4.5v15c0 1.1.9 1.5 1.5.8l11.5-7.5c.6-.4.6-1.3 0-1.7l-11.5-7.5c-.6-.7-1.5-.3-1.5.8z" />
  </svg>
);

const createSecureSlug = (title, type, id) => {
  const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const encodedData = btoa(`${type}:${id}`).replace(/=/g, ''); 
  return `${safeTitle}-${encodedData}`;
};

export default function ImpactPulseReader() {
  const { id: slugParam } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [isArticle, setIsArticle] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [sameTypeContent, setSameTypeContent] = useState([]);
  const [oppositeTypeContent, setOppositeTypeContent] = useState([]);
  const [unifiedContent, setUnifiedContent] = useState([]); 
  
  const [readProgress, setReadProgress] = useState(0);
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  
  // Animation state for smooth entering and exiting
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger smooth fade-in and slide-up on mount
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleBackNavigation = () => {
    // Trigger smooth fade-out and slide-down
    setIsVisible(false);
    // Wait for the CSS transition to finish before actually routing
    setTimeout(() => {
      navigate(-1);
    }, 300);
  };

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Impact Pulse`;
    } else {
      document.title = "Impact Pulse | Rafiki Afrik";
    }
  }, [post]);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setReadProgress(Math.min(progress, 100));
      setShowFloatingBar(scrollTop > 400);
    };

    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchContent = async () => {
      setLoading(true);
      setError(false);
      try {
        let decodedId = null;
        let decodedType = null;
        
        if (slugParam) {
          try {
            const parts = slugParam.split('-');
            const hash = parts.pop();
            const padding = hash.length % 4 === 0 ? '' : '='.repeat(4 - (hash.length % 4));
            const decodedString = atob(hash + padding);
            
            const [type, parsedId] = decodedString.split(':');
            if (type && parsedId) {
              decodedType = type;
              decodedId = parsedId;
            }
          } catch (e) {
            console.error("Failed to decode URL hash");
          }
        }

        let currentPost = null;
        let isArt = true;

        if (decodedType === 'video') {
          const res = await fetch(`http://127.0.0.1:8000/api/content/videos/${decodedId}/`);
          if (res.ok) { currentPost = await res.json(); isArt = false; }
        } else if (decodedType === 'article') {
          const res = await fetch(`http://127.0.0.1:8000/api/content/articles/${decodedId}/`);
          if (res.ok) { currentPost = await res.json(); isArt = true; }
        }

        if (!currentPost && decodedId) {
          const artRes = await fetch(`http://127.0.0.1:8000/api/content/articles/${decodedId}/`);
          if (artRes.ok) {
            currentPost = await artRes.json();
            isArt = true;
          } else {
            const vidRes = await fetch(`http://127.0.0.1:8000/api/content/videos/${decodedId}/`);
            if (vidRes.ok) {
              currentPost = await vidRes.json();
              isArt = false;
            }
          }
        }

        if (currentPost) {
          setPost(currentPost);
          setIsArticle(isArt);

          try {
            const [articlesRes, videosRes] = await Promise.all([
              fetch('http://127.0.0.1:8000/api/content/articles/'),
              fetch('http://127.0.0.1:8000/api/content/videos/')
            ]);
            
            const articlesData = await articlesRes.json();
            const videosData = await videosRes.json();

            const formattedArticles = articlesData.map(a => ({ ...a, type: 'article' }));
            const formattedVideos = videosData.map(v => ({ ...v, type: 'video' }));
            const allFormatted = [...formattedArticles, ...formattedVideos];

            const sortFn = (a, b) => new Date(b.published_date || b.created_at) - new Date(a.published_date || a.created_at);
            
            if (isArt) {
              setSameTypeContent(formattedArticles.filter(a => String(a.id) !== String(decodedId)).sort(sortFn));
              setOppositeTypeContent(formattedVideos.sort(sortFn).slice(0, 3));
            } else {
              setSameTypeContent(formattedVideos.filter(v => String(v.id) !== String(decodedId)).sort(sortFn));
              setOppositeTypeContent(formattedArticles.sort(sortFn).slice(0, 3));
            }

            const filteredUnified = allFormatted
              .filter(item => !(String(item.id) === String(decodedId) && item.type === (isArt ? 'article' : 'video')))
              .sort(sortFn)
              .slice(0, 4);
            setUnifiedContent(filteredUnified);

          } catch (err) {
            console.error("Failed to fetch related:", err);
          }

        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch content:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [slugParam]);

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = post?.title || "";
    const contentType = isArticle ? "article" : "video";
    const shareMessage = `Check out this ${contentType} from Impact Pulse: ${title}`;
    
    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(url)}`, "_blank");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
        break;
      case "whatsapp":
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage + ' - ' + url)}`, "_blank");
        break;
      case "copy":
        await navigator.clipboard.writeText(`${shareMessage}\n${url}`);
        alert("Link and text copied to clipboard!");
        break;
      default:
        break;
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium tracking-wide text-sm">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Post Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md">The article or video you are looking for doesn't exist or has been removed.</p>
        <button onClick={handleBackNavigation} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-primary/90 transition-colors">
          <MinimalBackIcon className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  const publishDate = new Date(post.published_date || post.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className={`min-h-screen bg-[#FDFCFB] pb-20 selection:bg-primary/20 relative w-full overflow-x-hidden transition-all duration-300 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-150"
        style={{ width: `${readProgress}%` }}
      />

      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 md:hidden ${showFloatingBar ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/95 backdrop-blur-xl rounded-full shadow-2xl border border-white/10">
          <span className="text-xs font-bold text-white/50 uppercase mr-2 tracking-widest">Share</span>
          <button onClick={() => handleShare("whatsapp")} className="p-2 text-white/70 hover:text-white"><WhatsAppIcon className="h-5 w-5" /></button>
          <button onClick={() => handleShare("twitter")} className="p-2 text-white/70 hover:text-white"><TwitterIcon className="h-5 w-5" /></button>
          <button onClick={() => handleShare("linkedin")} className="p-2 text-white/70 hover:text-white"><LinkedinIcon className="h-5 w-5" /></button>
          <button onClick={() => handleShare("copy")} className="p-2 text-white/70 hover:text-white"><Link2 className="h-5 w-5" /></button>
        </div>
      </div>

      <header className="max-w-5xl mx-auto px-6 pt-24 mb-12 relative z-10">
        
        {/* Sleek, Minimalist Animated Back Button */}
        <div className="mb-8">
          <button 
            onClick={handleBackNavigation} 
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-secondary hover:shadow-sm transition-all cursor-pointer"
            aria-label="Go Back"
          >
            <MinimalBackIcon className="w-5 h-5 text-gray-400 group-hover:text-secondary transition-colors" />
          </button>
        </div>

        {/* Category Pill */}
        <div className="mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1.5 rounded-md inline-block">
            {post.category?.name || 'Uncategorized'}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-primary leading-[1.1] tracking-tight mb-10">
          {post.title}
        </h1>

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3 text-gray-600">
            <div>
              <span className="font-semibold text-gray-900 block text-sm">{isArticle ? post.author : 'Rafiki Afrik'}</span>
              <span className="text-xs text-gray-500">Author</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-medium text-gray-900 text-sm block">{publishDate}</span>
            <span className="text-xs text-gray-500">Published</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 mb-16">
        {isArticle && post.featured_image ? (
          <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-gray-100 group">
            <div className="absolute inset-0 border border-black/5 rounded-2xl pointer-events-none z-10" />
            <img 
              src={post.featured_image} 
              alt={post.title} 
              className="w-full h-auto max-h-[500px] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
        ) : !isArticle ? (
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-gray-900">
            <iframe
              src={getEmbedUrl(post.youtube_url)}
              title={post.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : null}
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
          
          <div className="w-full min-w-0">
            <div 
              className="
                prose prose-lg max-w-none
                prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:leading-[1.8] prose-p:text-gray-800 prose-p:text-[17px] prose-p:mb-6
                prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-gray-50 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:font-serif prose-blockquote:text-xl prose-blockquote:text-gray-900 prose-blockquote:my-10
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-li:text-gray-800 prose-li:text-[17px] prose-li:leading-[1.8]
                [&_*]:!whitespace-normal [&_*]:!break-words [&_p]:!w-full
                [&_.ql-align-center]:text-center [&_.ql-align-right]:text-right [&_.ql-align-justify]:text-justify
                [&_img]:rounded-xl [&_img]:shadow-md [&_img]:mx-auto [&_img]:my-8
              "
              dangerouslySetInnerHTML={{ __html: isArticle ? post.body : post.description }}
            />

            <div className="mt-12 pt-6 border-t border-gray-200 flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Created by <strong className="text-gray-900 font-bold ml-1">{isArticle ? post.author : 'Rafiki Afrik'}</strong>
              </span>
            </div>
          </div>

          <aside className="hidden lg:block space-y-8 sticky top-28">
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Share</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <button onClick={() => handleShare("whatsapp")} className="p-3 rounded-xl bg-gray-50 hover:bg-[#25D366] hover:text-white transition-all flex items-center justify-center border border-gray-100 hover:border-[#25D366] flex-1">
                  <WhatsAppIcon className="h-4 w-4" />
                </button>
                <button onClick={() => handleShare("twitter")} className="p-3 rounded-xl bg-gray-50 hover:bg-[#1DA1F2] hover:text-white transition-all flex items-center justify-center border border-gray-100 hover:border-[#1DA1F2] flex-1">
                  <TwitterIcon className="h-4 w-4" />
                </button>
                <button onClick={() => handleShare("linkedin")} className="p-3 rounded-xl bg-gray-50 hover:bg-[#0A66C2] hover:text-white transition-all flex items-center justify-center border border-gray-100 hover:border-[#0A66C2] flex-1">
                  <LinkedinIcon className="h-4 w-4" />
                </button>
                <button onClick={() => handleShare("facebook")} className="p-3 rounded-xl bg-gray-50 hover:bg-[#1877F2] hover:text-white transition-all flex items-center justify-center border border-gray-100 hover:border-[#1877F2] flex-1">
                  <FacebookIcon className="h-4 w-4" />
                </button>
                <button onClick={() => handleShare("copy")} className="p-3 rounded-xl bg-gray-50 hover:bg-primary hover:text-white transition-all flex items-center justify-center border border-gray-100 hover:border-primary flex-1">
                  <Link2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Direct Portal to Impact Pulse Hub */}
            <Link
              to="/impact-pulse"
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border border-gray-200 bg-transparent text-gray-600 font-bold text-sm hover:bg-gray-50 hover:text-primary transition-colors cursor-pointer"
            >
              Explore Impact Pulse <ArrowRight className="w-4 h-4" />
            </Link>

            {sameTypeContent.length > 0 && (
              <div className="pt-8 border-t border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-6">
                  More {isArticle ? 'Articles' : 'Videos'}
                </h3>
                <div className="flex flex-col gap-6 max-h-[500px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {sameTypeContent.map((item, index) => (
                    <Link to={`/impact-pulse/${createSecureSlug(item.title, item.type, item.id)}`} key={`related-same-${item.type}-${item.id}-${index}`} className="group flex gap-4 items-start p-2 -ml-2 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                      <div className="w-28 h-20 shrink-0 rounded-xl overflow-hidden relative bg-gray-100">
                        <img 
                          src={item.type === 'article' ? item.featured_image : item.thumbnail} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors duration-500">
                            <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-secondary transition-all duration-300">
                              <PlayIcon className="h-3 w-3 text-primary ml-0.5 group-hover:text-white transition-colors duration-300" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <h4 className="text-base font-bold text-primary line-clamp-2 group-hover:text-secondary transition-colors leading-snug">
                          {item.title}
                        </h4>
                        <span className="text-[11px] font-bold text-gray-400 mt-1.5 block uppercase tracking-wider">
                          {new Date(item.published_date || item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Desktop Bottom Section: Opposite Type */}
      {oppositeTypeContent.length > 0 && (
        <div className="hidden lg:block max-w-5xl mx-auto px-6 mt-20 pt-16 border-t border-gray-200">
          <h2 className="text-2xl font-serif font-bold text-primary mb-8">
            {isArticle ? 'Watch Latest Videos' : 'Read Latest Articles'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {oppositeTypeContent.map((item, index) => (
              <Link to={`/impact-pulse/${createSecureSlug(item.title, item.type, item.id)}`} key={`related-opp-desk-${item.type}-${item.id}-${index}`} className="group block bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <img
                    src={item.type === 'article' ? item.featured_image : item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors duration-500">
                      <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-secondary transition-all duration-300">
                        <PlayIcon className="h-4 w-4 text-primary ml-0.5 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-2 block">
                    {item.category?.name || item.type}
                  </span>
                  <h3 className="font-serif font-bold text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.type === 'article' ? 'Read article' : 'Watch video'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile & Tablet Bottom Section: Unified Content */}
      {unifiedContent.length > 0 && (
        <div className="block lg:hidden max-w-5xl mx-auto px-6 mt-16 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-serif font-bold text-primary mb-8">
            More from Impact Pulse
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {unifiedContent.map((item, index) => (
              <Link to={`/impact-pulse/${createSecureSlug(item.title, item.type, item.id)}`} key={`related-uni-${item.type}-${item.id}-${index}`} className="group block bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <img
                    src={item.type === 'article' ? item.featured_image : item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors duration-500">
                      <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-secondary transition-all duration-300">
                        <PlayIcon className="h-4 w-4 text-primary ml-0.5 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-2 block">
                    {item.category?.name || item.type}
                  </span>
                  <h3 className="font-serif font-bold text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.type === 'article' ? 'Read article' : 'Watch video'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}