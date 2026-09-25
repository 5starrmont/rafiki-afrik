import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// SVGs
const MicIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>;
const SearchIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const EditIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const FolderIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const BackIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const CloseIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

// Helper to extract YouTube ID for automatic thumbnails
const getYouTubeThumbnail = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) 
    ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg` 
    : null;
};

export default function PodcastsHub() {
  const [activeView, setActiveView] = useState('hub'); 

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [podcasts, setPodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedPodcasts, setSelectedPodcasts] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, slug: null, mode: '' });

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/content/podcasts/');
        const data = await response.json();
        const sortedData = data.sort((a, b) => new Date(b.published_date) - new Date(a.published_date));
        setPodcasts(sortedData);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (activeView === 'library') {
      fetchPodcasts();
    }
  }, [activeView]);

  const filteredList = podcasts.filter(episode => {
    const matchesSearch = episode.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const now = new Date();
    const postDate = new Date(episode.published_date);
    const isScheduled = episode.is_published && postDate > now;
    const isDraft = !episode.is_published;
    const isLive = episode.is_published && postDate <= now;

    let matchesStatus = true;
    if (statusFilter === 'published') matchesStatus = isLive;
    if (statusFilter === 'scheduled') matchesStatus = isScheduled;
    if (statusFilter === 'drafts') matchesStatus = isDraft;

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setSelectedPodcasts([]);
  }, [searchTerm, statusFilter, activeView]);

  const toggleSelectAll = () => {
    if (selectedPodcasts.length === filteredList.length && filteredList.length > 0) {
      setSelectedPodcasts([]);
    } else {
      // Storing slug instead of id
      setSelectedPodcasts(filteredList.map(ep => ep.slug));
    }
  };

  const toggleSelectPodcast = (slug) => {
    setSelectedPodcasts(prev => prev.includes(slug) ? prev.filter(item => item !== slug) : [...prev, slug]);
  };

  const triggerDelete = (slug) => setDeleteModal({ isOpen: true, slug, mode: 'single' });
  const triggerBulkDelete = () => setDeleteModal({ isOpen: true, slug: null, mode: 'bulk' });
  const closeDeleteModal = () => setDeleteModal({ isOpen: false, slug: null, mode: '' });

  const confirmDelete = async () => {
    const { slug, mode } = deleteModal;
    
    if (mode === 'single') {
      try {
        await fetch(`http://127.0.0.1:8000/api/content/podcasts/${slug}/`, { method: 'DELETE' });
        setPodcasts(prev => prev.filter(item => item.slug !== slug));
      } catch (error) {
        alert("Network error while trying to delete.");
      }
    } else if (mode === 'bulk') {
      try {
        const deletePromises = selectedPodcasts.map(epSlug => 
          fetch(`http://127.0.0.1:8000/api/content/podcasts/${epSlug}/`, { method: 'DELETE' })
        );
        await Promise.all(deletePromises);
        setPodcasts(prev => prev.filter(item => !selectedPodcasts.includes(item.slug)));
        setSelectedPodcasts([]);
      } catch (error) {
        alert("Network error while trying to delete bulk items.");
      }
    }
    closeDeleteModal();
  };

  const handleTogglePublish = async (slug, currentStatus) => {
    const newStatus = !currentStatus;
    
    setPodcasts(prev => prev.map(item => item.slug === slug ? { ...item, is_published: newStatus } : item));

    try {
      const form = new FormData();
      form.append('is_published', newStatus ? 'true' : 'false');
      
      const res = await fetch(`http://127.0.0.1:8000/api/content/podcasts/${slug}/`, {
        method: 'PATCH',
        body: form,
      });
      
      if (!res.ok) throw new Error("Failed to update");
    } catch (err) {
      alert("Failed to update status on server.");
      setPodcasts(prev => prev.map(item => item.slug === slug ? { ...item, is_published: currentStatus } : item));
    }
  };

  const renderHub = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <Link 
        to="/admin/podcasts/new" 
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-purple-500 transition-all cursor-pointer"
      >
        <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-5"><MicIcon className="w-7 h-7" /></div>
        <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">Post an Episode</h3>
        <p className="text-sm text-gray-500 leading-relaxed">Embed a new podcast episode from YouTube.</p>
      </Link>

      <div 
        onClick={() => setActiveView('library')} 
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-primary transition-all cursor-pointer"
      >
        <div className="w-14 h-14 bg-gray-50 text-gray-700 rounded-xl flex items-center justify-center mb-5"><FolderIcon className="w-7 h-7" /></div>
        <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">Manage Library</h3>
        <p className="text-sm text-gray-500 leading-relaxed">Review, edit, publish, or schedule existing episodes.</p>
      </div>
    </div>
  );

  const renderLibrary = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <button onClick={() => setActiveView('hub')} className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary mb-6 transition-colors">
        <BackIcon className="w-4 h-4" /> Back to Hub
      </button>

      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { id: 'all', label: 'All Episodes' },
          { id: 'published', label: 'Live Published' },
          { id: 'scheduled', label: 'Scheduled' },
          { id: 'drafts', label: 'Drafts' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${
              statusFilter === tab.id ? 'bg-primary text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search episodes by title..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary" 
          />
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden relative">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500 font-medium">Loading episode library...</div>
        ) : filteredList.length === 0 ? (
          <div className="p-10 text-center text-gray-500 font-medium">No episodes found matching your filters.</div>
        ) : (
          <table className="w-full text-left relative">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <th className="p-5 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedPodcasts.length === filteredList.length && filteredList.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="p-5">Episode Title</th>
                <th className="p-5">Status</th>
                <th className="p-5">Date</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredList.map((episode) => {
                const now = new Date();
                const postDate = new Date(episode.published_date);
                const isScheduled = episode.is_published && postDate > now;
                const isSelected = selectedPodcasts.includes(episode.slug);
                const thumbUrl = getYouTubeThumbnail(episode.embed_url);

                return (
                  <tr key={episode.id} className={`hover:bg-gray-50/80 transition-colors group ${isSelected ? 'bg-purple-50/30' : ''}`}>
                    <td className="p-5 text-center">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelectPodcast(episode.slug)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        {thumbUrl ? (
                          <div className="w-20 h-14 bg-gray-200 rounded shadow-sm overflow-hidden flex-shrink-0 relative">
                            <img src={thumbUrl} alt={episode.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <MicIcon className="w-4 h-4 text-white opacity-80" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-20 h-14 bg-gray-100 rounded border border-gray-200 flex-shrink-0 flex items-center justify-center">
                            <MicIcon className="w-5 h-5 text-gray-300" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 text-sm mb-1">{episode.title}</p>
                          <a href={episode.embed_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">View Video</a>
                        </div>
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="flex flex-col items-start gap-1.5">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={episode.is_published}
                            onChange={() => handleTogglePublish(episode.slug, episode.is_published)}
                            className="sr-only peer" 
                          />
                          <div className={`w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${isScheduled ? 'peer-checked:bg-orange-400' : 'peer-checked:bg-emerald-500'}`}></div>
                          <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            {episode.is_published ? (isScheduled ? 'Scheduled' : 'Published') : 'Draft'}
                          </span>
                        </label>
                        {isScheduled && (
                          <span className="text-[9px] font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 mt-1">
                            For: {postDate.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'})}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-5 text-sm text-gray-500">{postDate.toLocaleDateString()}</td>
                    
                    <td className="p-5 text-right flex justify-end gap-1">
                      <Link to={`/admin/podcasts/edit/${episode.slug}`} className="p-2 text-gray-400 hover:text-primary transition-colors">
                        <EditIcon className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => triggerDelete(episode.slug)} 
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-heading font-black text-primary mb-2">Rafiki Podcasts</h1>
        <p className="text-base text-gray-500 font-medium">Your control center for audio stories, interviews, and conversations.</p>
      </div>

      {activeView === 'hub' && renderHub()}
      {activeView === 'library' && renderLibrary()}

      {selectedPodcasts.length > 0 && activeView === 'library' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-8 z-40 border border-gray-700/50">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full text-xs font-bold text-white shadow-sm">
              {selectedPodcasts.length}
            </span>
            <span className="text-sm font-medium text-gray-100">Episodes Selected</span>
          </div>
          
          <div className="w-px h-6 bg-gray-700"></div>
          
          <button 
            onClick={triggerBulkDelete}
            className="flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300 transition-colors group"
          >
            <TrashIcon className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> Bulk Delete
          </button>
          
          <button 
            onClick={() => setSelectedPodcasts([])}
            className="p-1.5 ml-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-6">
              <TrashIcon className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">
              {deleteModal.mode === 'single' ? 'Delete Episode?' : `Delete ${selectedPodcasts.length} Episodes?`}
            </h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Are you sure you want to delete {deleteModal.mode === 'single' ? "this episode" : "all selected episodes"}? This action is permanent and cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={closeDeleteModal}
                className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-6 py-2.5 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}