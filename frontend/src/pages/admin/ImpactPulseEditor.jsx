import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import JoditEditor from 'jodit-react';

// SVGs
const BackIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const ImageIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;

export default function ImpactPulseEditor() {
  const navigate = useNavigate();
  const { type, id } = useParams(); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const fileInputRef = useRef(null);
  
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const [postStatus, setPostStatus] = useState('live');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [originalDate, setOriginalDate] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '', 
    author: '',
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
    const fetchData = async () => {
      try {
        const catRes = await fetch('http://127.0.0.1:8000/api/content/categories/');
        const catData = await catRes.json();
        setCategories(catData);

        const endpoint = type === 'article' 
          ? `http://127.0.0.1:8000/api/content/articles/${id}/`
          : `http://127.0.0.1:8000/api/content/videos/${id}/`;
          
        const postRes = await fetch(endpoint);
        const postData = await postRes.json();

        setFormData({
          title: postData.title || '',
          category: postData.category ? postData.category.id : '',
          author: postData.author || '',
          reading_time: postData.reading_time || '',
          body: postData.body || '',
          youtube_url: postData.youtube_url || '',
          description: postData.description || '',
          is_featured: postData.is_featured || false,
        });

        const existingDate = postData.published_date ? new Date(postData.published_date) : new Date();
        setOriginalDate(existingDate);

        const offset = existingDate.getTimezoneOffset() * 60000;
        const localIso = new Date(existingDate - offset).toISOString();
        setScheduleDate(localIso.split('T')[0]);
        setScheduleTime(localIso.split('T')[1].slice(0, 5));

        const now = new Date();
        if (postData.is_published === false) {
          setPostStatus('draft');
        } else if (existingDate > now) {
          setPostStatus('scheduled');
        } else {
          setPostStatus('live');
        }

        const existingImage = type === 'article' ? postData.featured_image : postData.thumbnail;
        if (existingImage) {
          setMediaPreview(existingImage);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Failed to load post data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, type]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

  const handleUpdate = async () => {
    if (!formData.title) {
      alert("Title is required.");
      return;
    }

    let finalIsPublished = true;
    let finalPublishDate = originalDate ? originalDate.toISOString() : new Date().toISOString();

    if (postStatus === 'draft') {
      finalIsPublished = false;
    } else if (postStatus === 'scheduled') {
      finalIsPublished = true;
      if (!scheduleDate || !scheduleTime) {
        alert("Please select both a date and time for rescheduling.");
        return;
      }
      finalPublishDate = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
    } else if (postStatus === 'live') {
      finalIsPublished = true;
      if (originalDate > new Date() || finalIsPublished === false) {
        finalPublishDate = new Date().toISOString();
      }
    }

    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('is_featured', formData.is_featured);
    submitData.append('is_published', finalIsPublished);
    submitData.append('published_date', finalPublishDate);
    
    if (formData.category) submitData.append('category', formData.category);

    const endpoint = type === 'article' 
      ? `http://127.0.0.1:8000/api/content/articles/${id}/` 
      : `http://127.0.0.1:8000/api/content/videos/${id}/`;

    if (type === 'article') {
      submitData.append('author', formData.author);
      submitData.append('body', formData.body);
      submitData.append('reading_time', formData.reading_time);
      if (mediaFile) submitData.append('featured_image', mediaFile);
    } else {
      submitData.append('youtube_url', formData.youtube_url);
      submitData.append('description', formData.description);
      if (mediaFile) submitData.append('thumbnail', mediaFile);
    }

    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        body: submitData,
      });

      if (response.ok) {
        navigate('/admin/impact-pulse');
      } else {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        alert("Failed to update. Check console.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center text-gray-500 font-medium">Loading editor...</div>;
  }

  const displayType = type === 'article' ? 'Article' : 'Video';

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link to="/admin/impact-pulse" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary mb-8 transition-colors">
        <BackIcon className="w-4 h-4" /> Back to Hub
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-black text-primary mb-1">Edit {displayType}</h1>
          <p className="text-sm text-gray-500 font-medium">Update your content details below.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleUpdate}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
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
              className="w-full text-2xl font-heading font-bold text-primary placeholder:text-gray-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 font-medium focus:outline-none focus:border-primary"
              >
                <option value="">Select a category...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Post Status & Visibility</label>
              
              <div className="relative flex bg-gray-100 p-1 rounded-xl border border-gray-200 w-full">
                <div 
                  className={`absolute left-1 top-1 bottom-1 w-[calc(33.333%-4px)] bg-white rounded-lg shadow-sm border border-gray-200/50 transition-transform duration-300 ease-out ${
                    postStatus === 'live' ? 'translate-x-0' : 
                    postStatus === 'draft' ? 'translate-x-[calc(100%+4px)]' : 
                    'translate-x-[calc(200%+8px)]'
                  }`}
                />
                
                <button
                  type="button"
                  onClick={() => setPostStatus('live')}
                  className={`relative z-10 flex-1 px-2 py-2 text-xs font-bold rounded-lg transition-colors duration-300 ${
                    postStatus === 'live' ? 'text-green-600' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  Live Now
                </button>
                <button
                  type="button"
                  onClick={() => setPostStatus('draft')}
                  className={`relative z-10 flex-1 px-2 py-2 text-xs font-bold rounded-lg transition-colors duration-300 ${
                    postStatus === 'draft' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setPostStatus('scheduled')}
                  className={`relative z-10 flex-1 px-2 py-2 text-xs font-bold rounded-lg transition-colors duration-300 ${
                    postStatus === 'scheduled' ? 'text-orange-600' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  Reschedule
                </button>
              </div>

              <div className={`grid transition-all duration-300 ease-in-out ${postStatus === 'scheduled' ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
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
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">Post will be hidden and auto-republished at this time.</p>
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</label>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <JoditEditor
                    value={formData.description || ''}
                    config={{ ...editorConfig, height: 250 }}
                    onBlur={handleDescriptionChange}
                    onChange={() => {}}
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Article Body</label>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <JoditEditor
                    value={formData.body || ''}
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
              {type === 'video' ? 'Video Thumbnail' : 'Featured Cover Image'}
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
              className="w-full border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-primary transition-colors cursor-pointer p-8 flex flex-col items-center justify-center text-center overflow-hidden relative"
            >
              {mediaPreview ? (
                <img src={mediaPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 hover:opacity-40 transition-opacity" />
              ) : (
                <ImageIcon className="w-10 h-10 text-gray-300 mb-3" />
              )}
              <div className="relative z-10 bg-white/80 px-4 py-2 rounded-lg backdrop-blur-sm">
                <p className="text-sm font-bold text-gray-800 mb-1">Click to replace image</p>
                <p className="text-xs text-gray-500">Leave as is to keep current image</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-800">Feature on Homepage</p>
              <p className="text-xs text-gray-500 mt-0.5">Highlight this post in the main Spotlight section.</p>
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