import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import JoditEditor from 'jodit-react';

// SVGs
const BackIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const ClockIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const SendIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;

const YouTubeIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const SpotifyIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.3 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.781s.18-1.2.78-1.381c4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.239.54-.959.72-1.62.36z"/>
  </svg>
);

export default function PodcastEditor() {
  const navigate = useNavigate();
  // Using 'id' here assumes your App.jsx router setup uses /admin/podcasts/edit/:id
  // We will treat it as a slug.
  const { id: slug } = useParams(); 
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [publishMode, setPublishMode] = useState('now'); 
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  
  // Keep track of the original date so we don't accidentally bump the episode to the top of the list
  const [originalDate, setOriginalDate] = useState(null); 

  const [formData, setFormData] = useState({
    title: '',
    embed_url: '',
    spotify_url: '',
    description: '',
    is_featured: false,
  });

  // Fetch existing episode data
  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        // Fetching using the slug
        const response = await fetch(`http://127.0.0.1:8000/api/content/podcasts/${slug}/`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            title: data.title || '',
            embed_url: data.embed_url || '',
            spotify_url: data.spotify_url || '',
            description: data.description || '',
            is_featured: data.is_featured || false,
          });

          // Store the original published date
          setOriginalDate(data.published_date);

          const postDate = new Date(data.published_date);
          const now = new Date();
          
          if (postDate > now && data.is_published) {
            setPublishMode('later');
            // Adjust to local timezone to perfectly populate the input fields
            const localDate = new Date(postDate.getTime() - (postDate.getTimezoneOffset() * 60000));
            setScheduleDate(localDate.toISOString().split('T')[0]);
            setScheduleTime(localDate.toISOString().split('T')[1].slice(0, 5));
          } else {
            setPublishMode('now');
          }
        } else {
          alert("Episode not found!");
          navigate('/admin/podcasts');
        }
      } catch (error) {
        console.error("Error fetching episode:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEpisode();
  }, [slug, navigate]);

  const editorConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Write the episode description...',
    hidePoweredByJodit: true,
    toolbarAdaptive: false,
    buttons: ['bold', 'italic', 'underline', 'strikethrough', '|', 'ul', 'ol', '|', 'outdent', 'indent', '|', 'font', 'fontsize', 'brush', '|', 'link', 'align', 'undo', 'redo'],
    style: {
      fontFamily: 'inherit',
      fontSize: '16px',
    },
    height: 350
  }), []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDescriptionChange = (content) => {
    setFormData(prev => ({ ...prev, description: content }));
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.embed_url || !formData.spotify_url) {
      alert("Please enter a title, YouTube URL, and Spotify URL before saving.");
      return;
    }

    let finalPublishDate = '';
    
    if (publishMode === 'now') {
      if (originalDate && new Date(originalDate) <= new Date()) {
        finalPublishDate = originalDate; 
      } else {
        finalPublishDate = new Date().toISOString(); 
      }
    } else {
      if (!scheduleDate || !scheduleTime) {
        alert("Please select both a date and time to schedule this episode.");
        return;
      }
      finalPublishDate = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
    }

    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('embed_url', formData.embed_url);
    submitData.append('spotify_url', formData.spotify_url);
    submitData.append('description', formData.description);
    submitData.append('is_featured', formData.is_featured ? 'true' : 'false');
    submitData.append('is_published', 'true'); 
    submitData.append('published_date', finalPublishDate);
    
    try {
      // Patching using the slug
      const response = await fetch(`http://127.0.0.1:8000/api/content/podcasts/${slug}/`, {
        method: 'PATCH',
        body: submitData,
      });

      if (response.ok) {
        navigate('/admin/podcasts');
      } else {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        alert("Failed to update. Check console for details.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Failed to update episode. Please check the console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-4xl mx-auto py-32 text-center font-bold text-gray-400">Loading episode editor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link to="/admin/podcasts" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary mb-8 transition-colors">
        <BackIcon className="w-4 h-4" /> Back to Hub
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-heading font-black text-primary mb-1">Edit Episode</h1>
          <p className="text-sm text-gray-500 font-medium">Update the details of this podcast conversation.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handlePublish}
            disabled={isSubmitting}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm text-white transition-all shadow-sm disabled:opacity-50 flex items-center gap-2 ${
              publishMode === 'later' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {isSubmitting 
              ? 'Saving Changes...' 
              : (publishMode === 'now' 
                  ? <><SendIcon className="w-4 h-4"/> Save Changes</> 
                  : <><ClockIcon className="w-4 h-4"/> Schedule Changes</>
                )
            }
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-12">
        <div className="p-8 space-y-8">
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Episode Title</label>
            <input 
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., The Future of Tech in Africa" 
              className="w-full text-2xl font-heading font-bold text-primary placeholder:text-gray-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 items-start">
            
            {/* Links Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                  <YouTubeIcon className="w-4 h-4 text-[#FF0000]" /> YouTube URL
                </label>
                <input 
                  type="url"
                  name="embed_url"
                  value={formData.embed_url}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                  <SpotifyIcon className="w-3.5 h-3.5 text-[#1DB954]" /> Spotify URL
                </label>
                <input 
                  type="url"
                  name="spotify_url"
                  value={formData.spotify_url}
                  onChange={handleChange}
                  placeholder="https://open.spotify.com/episode/..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 font-medium focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]"
                />
              </div>
            </div>
            
            {/* Publishing Column */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Publishing Mode</label>
              <div className="relative flex bg-gray-100 p-1 rounded-xl border border-gray-200 w-full">
                <div 
                  className={`absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm border border-gray-200/50 transition-transform duration-300 ease-out ${
                    publishMode === 'now' ? 'translate-x-0' : 'translate-x-full'
                  }`}
                />
                
                <button
                  type="button"
                  onClick={() => setPublishMode('now')}
                  className={`relative z-10 flex-1 px-4 py-2 text-sm font-bold rounded-lg transition-colors duration-300 ${
                    publishMode === 'now' ? 'text-primary' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  Publish Now
                </button>
                <button
                  type="button"
                  onClick={() => setPublishMode('later')}
                  className={`relative z-10 flex-1 px-4 py-2 text-sm font-bold rounded-lg transition-colors duration-300 ${
                    publishMode === 'later' ? 'text-orange-600' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  Schedule Later
                </button>
              </div>

              <div className={`grid transition-all duration-300 ease-in-out ${publishMode === 'later' ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                <div className="overflow-hidden">
                  <div className="flex gap-4 w-full">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Date</label>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full bg-white border border-orange-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 font-medium focus:outline-none focus:border-orange-500 shadow-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Time</label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full bg-white border border-orange-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 font-medium focus:outline-none focus:border-orange-500 shadow-sm"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">Episode will remain hidden until this exact date and time.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Episode Description</label>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <JoditEditor
                value={formData.description}
                config={editorConfig}
                onBlur={handleDescriptionChange}
                onChange={() => {}} 
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-800">Feature on Homepage</p>
              <p className="text-xs text-gray-500 mt-0.5">Highlight this episode in the main Spotlight section.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

        </div>
      </div>
    </div>
  )
}