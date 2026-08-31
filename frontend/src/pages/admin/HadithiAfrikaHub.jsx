import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contentAPI } from '../../services/api';

// SVGs
const FilmIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>;
const SearchIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const EditIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const FolderIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const BackIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const CloseIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

export default function HadithiAfrikaHub() {
  const [activeView, setActiveView] = useState('hub'); 

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [films, setFilms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Bulk Selection State
  const [selectedFilms, setSelectedFilms] = useState([]);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    mode: '' 
  });

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await contentAPI.getFilms();
        // Sort by date descending
        const sortedData = response.data.sort((a, b) => new Date(b.published_date) - new Date(a.published_date));
        setFilms(sortedData);
      } catch (error) {
        console.error("Error fetching films:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilms();
  }, []);

  const filteredList = films.filter(film => {
    const matchesSearch = film.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const now = new Date();
    const postDate = new Date(film.published_date);
    const isScheduled = film.is_published && postDate > now;
    const isDraft = !film.is_published;
    const isLive = film.is_published && postDate <= now;

    let matchesStatus = true;
    if (statusFilter === 'published') matchesStatus = isLive;
    if (statusFilter === 'scheduled') matchesStatus = isScheduled;
    if (statusFilter === 'drafts') matchesStatus = isDraft;

    return matchesSearch && matchesStatus;
  });

  // Clear selections if the user changes filters or views
  useEffect(() => {
    setSelectedFilms([]);
  }, [searchTerm, statusFilter, activeView]);

  const toggleSelectAll = () => {
    if (selectedFilms.length === filteredList.length && filteredList.length > 0) {
      setSelectedFilms([]);
    } else {
      setSelectedFilms(filteredList.map(film => film.id));
    }
  };

  const toggleSelectFilm = (id) => {
    setSelectedFilms(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const triggerDeleteContent = (id) => {
    setDeleteModal({ isOpen: true, id, mode: 'content' });
  };

  const triggerBulkDelete = () => {
    setDeleteModal({ isOpen: true, id: null, mode: 'bulk-content' });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, id: null, mode: '' });
  };

  const confirmDelete = async () => {
    const { id, mode } = deleteModal;

    if (mode === 'content') {
      try {
        await contentAPI.deleteFilm(id);
        setFilms(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error deleting:", error);
        alert("Network error while trying to delete.");
      }
    } 
    else if (mode === 'bulk-content') {
      try {
        const deletePromises = selectedFilms.map(filmId => contentAPI.deleteFilm(filmId));
        await Promise.all(deletePromises);
        setFilms(prev => prev.filter(item => !selectedFilms.includes(item.id)));
        setSelectedFilms([]);
      } catch (error) {
        console.error("Error bulk deleting:", error);
        alert("Network error while trying to delete some items.");
      }
    }

    closeDeleteModal();
  };

  const handleTogglePublish = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    
    // Optimistic UI Update
    setFilms(prev => prev.map(item => 
      item.id === id ? { ...item, is_published: newStatus } : item
    ));

    try {
      const form = new FormData();
      // Django requires explicit string representation of booleans in FormData
      form.append('is_published', newStatus ? 'true' : 'false');
      await contentAPI.updateFilm(id, form);
    } catch (err) {
      console.error(err);
      alert("Failed to update status on server.");
      // Revert on failure
      setFilms(prev => prev.map(item => 
        item.id === id ? { ...item, is_published: currentStatus } : item
      ));
    }
  };

  const renderHub = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <Link 
        to="/admin/hadithi-afrika/new" 
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-red-500 transition-all cursor-pointer"
      >
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-5"><FilmIcon className="w-7 h-7" /></div>
        <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">Post a Film</h3>
        <p className="text-sm text-gray-500 leading-relaxed">Upload a new documentary or original production release.</p>
      </Link>

      <div 
        onClick={() => setActiveView('library')} 
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-primary transition-all cursor-pointer"
      >
        <div className="w-14 h-14 bg-gray-50 text-gray-700 rounded-xl flex items-center justify-center mb-5"><FolderIcon className="w-7 h-7" /></div>
        <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">Manage Library</h3>
        <p className="text-sm text-gray-500 leading-relaxed">Review, edit, publish, or schedule existing film entries.</p>
      </div>
    </div>
  );

  const renderLibrary = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <button onClick={() => setActiveView('hub')} className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary mb-6 transition-colors">
        <BackIcon className="w-4 h-4" /> Back to Hub
      </button>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { id: 'all', label: 'All Films' },
          { id: 'published', label: 'Live Published' },
          { id: 'scheduled', label: 'Scheduled' },
          { id: 'drafts', label: 'Drafts' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${
              statusFilter === tab.id 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900'
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
            placeholder="Search films by title..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary" 
          />
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden relative">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500 font-medium">Loading film library...</div>
        ) : filteredList.length === 0 ? (
          <div className="p-10 text-center text-gray-500 font-medium">No films found matching your current filters.</div>
        ) : (
          <table className="w-full text-left relative">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <th className="p-5 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedFilms.length === filteredList.length && filteredList.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="p-5">Film Title</th>
                <th className="p-5">Release Year</th>
                <th className="p-5">Status</th>
                <th className="p-5">Date</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredList.map((film) => {
                const now = new Date();
                const postDate = new Date(film.published_date);
                const isScheduled = film.is_published && postDate > now;
                const isSelected = selectedFilms.includes(film.id);

                return (
                  <tr key={film.id} className={`hover:bg-gray-50/80 transition-colors group ${isSelected ? 'bg-red-50/30' : ''}`}>
                    <td className="p-5 text-center">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelectFilm(film.id)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        {film.poster_image ? (
                          <div className="w-10 h-14 bg-gray-200 rounded shadow-sm overflow-hidden flex-shrink-0">
                            <img src={film.poster_image} alt={film.title} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-14 bg-gray-100 rounded border border-gray-200 flex-shrink-0 flex items-center justify-center">
                            <FilmIcon className="w-4 h-4 text-gray-300" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 text-sm mb-1">{film.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-sm text-gray-600 font-medium">{film.release_year || 'TBA'}</span>
                    </td>

                    <td className="p-5">
                      <div className="flex flex-col items-start gap-1.5">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={film.is_published}
                            onChange={() => handleTogglePublish(film.id, film.is_published)}
                            className="sr-only peer" 
                          />
                          <div className={`w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${isScheduled ? 'peer-checked:bg-orange-400' : 'peer-checked:bg-emerald-500'}`}></div>
                          <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            {film.is_published ? (isScheduled ? 'Scheduled' : 'Published') : 'Draft'}
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
                      <Link to={`/admin/hadithi-afrika/edit/${film.id}`} className="p-2 text-gray-400 hover:text-primary transition-colors">
                        <EditIcon className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => triggerDeleteContent(film.id)} 
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
        <h1 className="text-4xl font-heading font-black text-primary mb-2">Hadithi Afrika</h1>
        <p className="text-base text-gray-500 font-medium">Your control center for original films and cinematic storytelling.</p>
      </div>

      {activeView === 'hub' && renderHub()}
      {activeView === 'library' && renderLibrary()}

      {/* Floating Bulk Action Bar */}
      {selectedFilms.length > 0 && activeView === 'library' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-8 z-40 border border-gray-700/50">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full text-xs font-bold text-white shadow-sm">
              {selectedFilms.length}
            </span>
            <span className="text-sm font-medium text-gray-100">Films Selected</span>
          </div>
          
          <div className="w-px h-6 bg-gray-700"></div>
          
          <button 
            onClick={triggerBulkDelete}
            className="flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300 transition-colors group"
          >
            <TrashIcon className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> Bulk Delete
          </button>
          
          <button 
            onClick={() => setSelectedFilms([])}
            className="p-1.5 ml-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
            title="Clear Selection"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Reusable Custom Delete Modal Overlay */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-6">
              <TrashIcon className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">
              {deleteModal.mode === 'content' ? 'Delete Film?' : `Delete ${selectedFilms.length} Films?`}
            </h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              {deleteModal.mode === 'content' 
                ? "Are you sure you want to delete this film? This action is permanent and cannot be undone." 
                : "Are you sure you want to delete all selected films? This action is permanent and cannot be undone."}
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