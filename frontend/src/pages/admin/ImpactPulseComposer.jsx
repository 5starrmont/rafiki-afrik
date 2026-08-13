import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import JoditEditor from 'jodit-react';

// SVGs
const BackIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const ImageIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const ClockIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const SendIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;

export default function ImpactPulseComposer() {
  const navigate = useNavigate();
  const { type } = useParams(); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const fileInputRef = useRef(null);
  
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const [publishMode, setPublishMode] = useState('now'); 
  
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: '', 
    author: 'Rafiki Afrik',
    reading_time: '',
    body: '',
    youtube_url: '',
    description: '', 
    is_featured: false,
  });

  // Clean Configuration for Jodit Editor
  const editorConfig = {
    readonly: false,
    placeholder: 'Start writing your amazing content here...',
    hidePoweredByJodit: true,
    toolbarAdaptive: false,
    buttons: ['bold', 'italic', 'underline', 'strikethrough', '|', 'ul', 'ol', '|', 'outdent', 'indent', '|', 'font', 'fontsize', 'brush', '|', 'link', 'align', 'undo', 'redo'],
    style: {
      fontFamily: 'inherit',
      fontSize: '16px',
    }
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/content/categories/')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };

  const handleBodyChange = (content) => {
    setFormData(prev => ({ ...prev, body: content }));
  };

  const handleDescriptionChange = (content) => {
    setFormData(prev => ({ ...prev, description: content }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handlePublish = async () => {
    if (!formData.title) {
      alert("Please enter a title before publishing.");
      return;
    }
    if (!mediaFile) {
      alert("Please upload an image or thumbnail!");
      return;
    }

    let finalPublishDate = '';
    if (publishMode === 'now') {
      finalPublishDate = new Date().toISOString(); 
    } else {
      if (!scheduleDate || !scheduleTime) {
        alert("Please select both a date and time to schedule this post.");
        return;
      }
      finalPublishDate = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
    }

    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('is_featured', formData.is_featured);
    submitData.append('is_published', true); 
    submitData.append('published_date', finalPublishDate);
    
    if (formData.category) submitData.append('category', formData.category);

    const endpoint = type === 'article' 
      ? 'http://127.0.0.1:8000/api/content/articles/' 
      : 'http://127.0.0.1:8000/api/content/videos/';

    if (type === 'article') {
      submitData.append('author', formData.author);
      submitData.append('body', formData.body); 
      submitData.append('reading_time', formData.reading_time);
      submitData.append('featured_image', mediaFile);
    } else {
      submitData.append('youtube_url', formData.youtube_url);
      submitData.append('description', formData.description);
      submitData.append('thumbnail', mediaFile);
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        navigate('/admin/impact-pulse');
      } else {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        alert("Failed to publish. Check console for details.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayType = type === 'article' ? 'Article' : 'Video';

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link to="/admin/impact-pulse" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary mb-8 transition-colors">
        <BackIcon className="w-4 h-4" /> Back to Hub
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-heading font-black text-primary mb-1">Create {displayType}</h1>
          <p className="text-sm text-gray-500 font-medium">Publish a new {type} to the Impact Pulse library.</p>
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
              ? (publishMode === 'now' ? 'Publishing...' : 'Scheduling...') 
              : (publishMode === 'now' 
                  ? <><SendIcon className="w-4 h-4"/> Publish Now</> 
                  : <><ClockIcon className="w-4 h-4"/> Schedule Post</>
                )
            }
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-12">
        <div className="p-8 space-y-8">
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Post Title</label>
            <input 
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a captivating title..." 
              className={`w-full text-2xl font-heading font-bold text-primary placeholder:text-gray-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent`}
            />
          </div>

          <div className="grid grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 font-medium focus:outline-none focus:border-primary"
              >
                <option value="">Select a category...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
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
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">Post will remain hidden until this exact date and time.</p>
                </div>
              </div>
            </div>
          </div>

          {type === 'video' && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">YouTube URL</label>
                <input 
                  type="url" 
                  name="youtube_url"
                  value={formData.youtube_url}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</label>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <JoditEditor
                    value={formData.description}
                    config={{ ...editorConfig, height: 250 }}
                    onBlur={handleDescriptionChange}
                    onChange={() => {}} // Keeps React happy without causing re-renders mid-type
                  />
                </div>
              </div>
            </>
          )}

          {type === 'article' && (
            <>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Author Name</label>
                  <input 
                    type="text" 
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="e.g. Rafiki Afrik" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Reading Time</label>
                  <input 
                    type="text" 
                    name="reading_time"
                    value={formData.reading_time}
                    onChange={handleChange}
                    placeholder="e.g. 5 min read" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Article Body</label>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <JoditEditor
                    value={formData.body}
                    config={{ ...editorConfig, height: 500 }}
                    onBlur={handleBodyChange}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {type === 'video' ? 'Video Thumbnail (Required)' : 'Featured Cover Image (Required)'}
            </label>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            <div 
              onClick={() => fileInputRef.current.click()}
              className={`w-full border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 ${type === 'video' ? 'hover:border-orange-500' : 'hover:border-blue-500'} transition-colors cursor-pointer p-8 flex flex-col items-center justify-center text-center overflow-hidden relative`}
            >
              {mediaPreview ? (
                <img src={mediaPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 hover:opacity-40 transition-opacity" />
              ) : (
                <ImageIcon className="w-10 h-10 text-gray-300 mb-3" />
              )}
              <div className="relative z-10 bg-white/80 px-4 py-2 rounded-lg backdrop-blur-sm">
                <p className="text-sm font-bold text-gray-800 mb-1">{mediaPreview ? 'Click to change image' : 'Click to upload image'}</p>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}