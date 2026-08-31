import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import { contentAPI } from '../../services/api';

// SVGs
const BackIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const ImageIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const ClockIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const SendIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;

export default function HadithiAfrikaComposer() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const [publishMode, setPublishMode] = useState('now'); 
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    release_year: '',
    video_url: '',
    is_featured: false,
  });

  const editorConfig = {
    readonly: false,
    placeholder: 'Write a compelling synopsis for this film...',
    hidePoweredByJodit: true,
    toolbarAdaptive: false,
    buttons: ['bold', 'italic', 'underline', 'strikethrough', '|', 'ul', 'ol', '|', 'outdent', 'indent', '|', 'font', 'fontsize', 'brush', '|', 'link', 'align', 'undo', 'redo'],
    style: {
      fontFamily: 'inherit',
      fontSize: '16px',
    }
  };

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
      alert("Please upload a poster image!");
      return;
    }

    let finalPublishDate = '';
    if (publishMode === 'now') {
      finalPublishDate = new Date().toISOString(); 
    } else {
      if (!scheduleDate || !scheduleTime) {
        alert("Please select both a date and time to schedule this film.");
        return;
      }
      finalPublishDate = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
    }

    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    
    // Explicitly stringifying booleans for Django DRF
    submitData.append('is_featured', formData.is_featured ? 'true' : 'false');
    submitData.append('is_published', 'true'); 
    submitData.append('published_date', finalPublishDate);
    
    if (formData.release_year) submitData.append('release_year', formData.release_year);
    if (formData.video_url) submitData.append('video_url', formData.video_url);
    if (mediaFile) submitData.append('poster_image', mediaFile);

    try {
      await contentAPI.createFilm(submitData);
      navigate('/admin/hadithi-afrika');
    } catch (error) {
      console.error("Error creating film:", error);
      alert("Failed to publish film. Please check the console for details.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link to="/admin/hadithi-afrika" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary mb-8 transition-colors">
        <BackIcon className="w-4 h-4" /> Back to Hub
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-heading font-black text-primary mb-1">Create Film</h1>
          <p className="text-sm text-gray-500 font-medium">Publish a new production to the Hadithi Afrika catalog.</p>
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
                  : <><ClockIcon className="w-4 h-4"/> Schedule Film</>
                )
            }
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-12">
        <div className="p-8 space-y-8">
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Film Title</label>
            <input 
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Breaking Through" 
              className="w-full text-2xl font-heading font-bold text-primary placeholder:text-gray-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Release Year</label>
              <input 
                type="number"
                name="release_year"
                value={formData.release_year}
                onChange={handleChange}
                placeholder="e.g., 2026"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 font-medium focus:outline-none focus:border-primary"
              />
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
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">Film will remain hidden until this exact date and time.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">YouTube URL</label>
            <input 
              type="url" 
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Synopsis / Description</label>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <JoditEditor
                value={formData.description}
                config={{ ...editorConfig, height: 350 }}
                onBlur={handleDescriptionChange}
                onChange={() => {}} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Poster Image (Required)</label>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            <div 
              onClick={() => fileInputRef.current.click()}
              className="w-full border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-red-500 transition-colors cursor-pointer p-8 flex flex-col items-center justify-center text-center overflow-hidden relative"
            >
              {mediaPreview ? (
                <img src={mediaPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 hover:opacity-40 transition-opacity" />
              ) : (
                <ImageIcon className="w-10 h-10 text-gray-300 mb-3" />
              )}
              <div className="relative z-10 bg-white/80 px-4 py-2 rounded-lg backdrop-blur-sm">
                <p className="text-sm font-bold text-gray-800 mb-1">{mediaPreview ? 'Click to change image' : 'Click to upload image'}</p>
                <p className="text-xs text-gray-500">High-resolution portrait (2:3 ratio) up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-800">Feature on Homepage</p>
              <p className="text-xs text-gray-500 mt-0.5">Highlight this film in the main Spotlight section.</p>
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