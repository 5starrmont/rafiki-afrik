import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// SVGs
const PlusIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const FileTextIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="17"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const VideoIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>;
const SearchIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const EditIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const FolderIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const BackIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const TagIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
const CheckIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>;
const CloseIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

export default function ImpactPulseHub() {
  const [activeView, setActiveView] = useState('hub'); 

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all'); 
  const [statusFilter, setStatusFilter] = useState('all');
  const [contentList, setContentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  // Bulk Selection State
  const [selectedPosts, setSelectedPosts] = useState([]);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    originalId: null,
    type: null,
    mode: '' 
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [articlesRes, videosRes, categoriesRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/content/articles/'),
          fetch('http://127.0.0.1:8000/api/content/videos/'),
          fetch('http://127.0.0.1:8000/api/content/categories/')
        ]);

        const articlesData = articlesRes.ok ? await articlesRes.json() : [];
        const videosData = videosRes.ok ? await videosRes.json() : [];
        const categoriesData = categoriesRes.ok ? await categoriesRes.json() : [];

        const normalizedArticles = articlesData.map(item => ({
          id: `art-${item.id}`,
          originalId: item.id,
          title: item.title,
          type: 'article',
          categoryName: item.category?.name || 'Uncategorized',
          is_published: item.is_published !== false, 
          date: item.published_date || item.created_at || new Date().toISOString(),
          author: item.author || 'Admin',
        }));

        const normalizedVideos = videosData.map(item => ({
          id: `vid-${item.id}`,
          originalId: item.id,
          title: item.title,
          type: 'video',
          categoryName: item.category?.name || 'Uncategorized',
          is_published: item.is_published !== false,
          date: item.published_date || item.created_at || new Date().toISOString(),
          author: 'Rafiki Afrik',
        }));

        const combined = [...normalizedArticles, ...normalizedVideos].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        
        setContentList(combined);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const filteredList = contentList.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || post.type === filterType;
    const matchesCategory = categoryFilter === 'all' || post.categoryName === categoryFilter;
    
    const now = new Date();
    const postDate = new Date(post.date);
    const isScheduled = post.is_published && postDate > now;
    const isDraft = !post.is_published;
    const isLive = post.is_published && postDate <= now;

    let matchesStatus = true;
    if (statusFilter === 'published') matchesStatus = isLive;
    if (statusFilter === 'scheduled') matchesStatus = isScheduled;
    if (statusFilter === 'drafts') matchesStatus = isDraft;

    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  // Clear selections if the user changes filters or views
  useEffect(() => {
    setSelectedPosts([]);
  }, [searchTerm, filterType, categoryFilter, statusFilter, activeView]);

  const toggleSelectAll = () => {
    if (selectedPosts.length === filteredList.length && filteredList.length > 0) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredList.map(post => post.id));
    }
  };

  const toggleSelectPost = (id) => {
    setSelectedPosts(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    setIsAddingCategory(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/content/categories/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName })
      });
      
      if (res.ok) {
        const newCat = await res.json();
        setCategories([...categories, newCat]);
        setNewCategoryName('');
        setActiveView('manageCategories');
      } else {
        alert('Failed to add category.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleUpdateCategory = async (id) => {
    if (!editingCategoryName.trim()) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/content/categories/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingCategoryName })
      });

      if (response.ok) {
        const updatedCat = await response.json();
        const oldName = categories.find(c => c.id === id)?.name;

        setCategories(prev => prev.map(c => c.id === id ? updatedCat : c));
        setContentList(prev => prev.map(item => 
          item.categoryName === oldName ? { ...item, categoryName: updatedCat.name } : item
        ));

        setEditingCategoryId(null);
        setEditingCategoryName('');
      } else {
        alert('Failed to update category.');
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert('Network error while trying to update.');
    }
  };

  const triggerDeleteContent = (id, originalId, type) => {
    setDeleteModal({ isOpen: true, id, originalId, type, mode: 'content' });
  };

  const triggerBulkDelete = () => {
    setDeleteModal({ isOpen: true, id: null, originalId: null, type: null, mode: 'bulk-content' });
  };

  const triggerDeleteCategory = (id) => {
    setDeleteModal({ isOpen: true, id, originalId: null, type: null, mode: 'category' });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, id: null, originalId: null, type: null, mode: '' });
  };

  const confirmDelete = async () => {
    const { id, originalId, type, mode } = deleteModal;

    if (mode === 'content') {
      const endpoint = type === 'article' 
        ? `http://127.0.0.1:8000/api/content/articles/${originalId}/`
        : `http://127.0.0.1:8000/api/content/videos/${originalId}/`;

      try {
        const response = await fetch(endpoint, { method: 'DELETE' });
        if (response.ok || response.status === 204) {
          setContentList(prev => prev.filter(item => item.id !== id));
        } else {
          alert("Failed to delete content.");
        }
      } catch (error) {
        console.error("Error deleting:", error);
        alert("Network error while trying to delete.");
      }
    } 
    
    else if (mode === 'bulk-content') {
      try {
        const deletePromises = selectedPosts.map(postId => {
          const post = contentList.find(p => p.id === postId);
          if (!post) return Promise.resolve();
          const endpoint = post.type === 'article'
            ? `http://127.0.0.1:8000/api/content/articles/${post.originalId}/`
            : `http://127.0.0.1:8000/api/content/videos/${post.originalId}/`;
          return fetch(endpoint, { method: 'DELETE' });
        });

        await Promise.all(deletePromises);
        setContentList(prev => prev.filter(item => !selectedPosts.includes(item.id)));
        setSelectedPosts([]);
      } catch (error) {
        console.error("Error bulk deleting:", error);
        alert("Network error while trying to delete some items.");
      }
    }

    else if (mode === 'category') {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/content/categories/${id}/`, {
          method: 'DELETE'
        });
        if (response.ok || response.status === 204) {
          setCategories(prev => prev.filter(cat => cat.id !== id));
          setContentList(prev => prev.map(item => 
            item.categoryName === categories.find(c => c.id === id)?.name 
              ? { ...item, categoryName: 'Uncategorized' } 
              : item
          ));
        } else {
          alert("Failed to delete category.");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Network error while trying to delete.");
      }
    }

    closeDeleteModal();
  };

  const handleTogglePublish = async (id, originalId, type, currentStatus) => {
    const newStatus = !currentStatus;
    
    setContentList(prev => prev.map(item => 
      item.id === id ? { ...item, is_published: newStatus } : item
    ));

    const endpoint = type === 'article' 
      ? `http://127.0.0.1:8000/api/content/articles/${originalId}/`
      : `http://127.0.0.1:8000/api/content/videos/${originalId}/`;

    try {
      const form = new FormData();
      form.append('is_published', newStatus);
      
      const res = await fetch(endpoint, { method: 'PATCH', body: form });
      
      if (!res.ok) {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status on server.");
      setContentList(prev => prev.map(item => 
        item.id === id ? { ...item, is_published: currentStatus } : item
      ));
    }
  };

  const renderHub = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <Link 
        to="/admin/impact-pulse/new/article" 
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer"
      >
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5"><FileTextIcon className="w-7 h-7" /></div>
        <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">Post an Article</h3>
        <p className="text-sm text-gray-500 leading-relaxed">Write and publish a new thought-provoking article.</p>
      </Link>

      <Link 
        to="/admin/impact-pulse/new/video" 
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-orange-500 transition-all cursor-pointer"
      >
        <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-5"><VideoIcon className="w-7 h-7" /></div>
        <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">Post a Video</h3>
        <p className="text-sm text-gray-500 leading-relaxed">Embed a new YouTube documentary or video story.</p>
      </Link>

      <div 
        onClick={() => setActiveView('library')} 
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-primary transition-all cursor-pointer"
      >
        <div className="w-14 h-14 bg-gray-50 text-gray-700 rounded-xl flex items-center justify-center mb-5"><FolderIcon className="w-7 h-7" /></div>
        <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">Manage Library</h3>
        <p className="text-sm text-gray-500 leading-relaxed">Review, edit, publish, or schedule existing content.</p>
      </div>

      <div 
        onClick={() => setActiveView('addCategory')} 
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-emerald-500 transition-all cursor-pointer"
      >
        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5"><PlusIcon className="w-7 h-7" /></div>
        <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">Add Category</h3>
        <p className="text-sm text-gray-500 leading-relaxed">Create new tags to organize your platform's content.</p>
      </div>

      <div 
        onClick={() => setActiveView('manageCategories')} 
        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-purple-500 transition-all cursor-pointer"
      >
        <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-5"><TagIcon className="w-7 h-7" /></div>
        <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">Manage Categories</h3>
        <p className="text-sm text-gray-500 leading-relaxed">View and organize all existing content categories.</p>
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
          { id: 'all', label: 'All Content' },
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
          <input type="text" placeholder="Search publications..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary" />
        </div>
        
        {/* Format and Category Dropdowns */}
        <div className="flex gap-4 w-full md:w-auto">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="flex-1 md:flex-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600 font-medium focus:outline-none focus:border-secondary cursor-pointer">
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
            <option value="Uncategorized">Uncategorized</option>
          </select>

          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="flex-1 md:flex-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600 font-medium focus:outline-none focus:border-secondary cursor-pointer">
            <option value="all">All Formats</option>
            <option value="article">Articles</option>
            <option value="video">Videos</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden relative">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500 font-medium">Loading your library...</div>
        ) : filteredList.length === 0 ? (
          <div className="p-10 text-center text-gray-500 font-medium">No posts found matching your current filters.</div>
        ) : (
          <table className="w-full text-left relative">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <th className="p-5 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedPosts.length === filteredList.length && filteredList.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="p-5">Title</th>
                <th className="p-5">Format</th>
                <th className="p-5">Category</th>
                <th className="p-5">Status</th>
                <th className="p-5">Date</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredList.map((post) => {
                const now = new Date();
                const postDate = new Date(post.date);
                const isScheduled = post.is_published && postDate > now;
                const isSelected = selectedPosts.includes(post.id);

                return (
                  <tr key={post.id} className={`hover:bg-gray-50/80 transition-colors group ${isSelected ? 'bg-blue-50/30' : ''}`}>
                    <td className="p-5 text-center">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelectPost(post.id)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </td>
                    <td className="p-5">
                      <p className="font-bold text-gray-900 text-sm mb-1">{post.title}</p>
                      <p className="text-xs text-gray-400 font-medium">By {post.author}</p>
                    </td>
                    <td className="p-5"><span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{post.type}</span></td>
                    
                    <td className="p-5">
                      <span className="text-xs text-gray-600 font-medium">{post.categoryName}</span>
                    </td>

                    <td className="p-5">
                      <div className="flex flex-col items-start gap-1.5">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={post.is_published}
                            onChange={() => handleTogglePublish(post.id, post.originalId, post.type, post.is_published)}
                            className="sr-only peer" 
                          />
                          <div className={`w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${isScheduled ? 'peer-checked:bg-orange-400' : 'peer-checked:bg-emerald-500'}`}></div>
                          <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            {post.is_published ? (isScheduled ? 'Scheduled' : 'Published') : 'Draft'}
                          </span>
                        </label>
                        {isScheduled && (
                          <span className="text-[9px] font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                            For: {postDate.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'})}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-5 text-sm text-gray-500">{postDate.toLocaleDateString()}</td>
                    
                    <td className="p-5 text-right flex justify-end gap-1">
                      <Link to={`/admin/impact-pulse/edit/${post.type}/${post.originalId}`} className="p-2 text-gray-400 hover:text-primary transition-colors">
                        <EditIcon className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => triggerDeleteContent(post.id, post.originalId, post.type)} 
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

  const renderAddCategory = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <button onClick={() => setActiveView('hub')} className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary mb-6 transition-colors">
        <BackIcon className="w-4 h-4" /> Back to Hub
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-2xl font-heading font-bold text-primary">Add New Category</h2>
          <p className="text-sm text-gray-500 mt-1">Create a new content tag for your articles and videos.</p>
        </div>
        <form onSubmit={handleAddCategory} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Category Name</label>
            <input 
              type="text" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. Climate Tech" 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button 
            type="submit" 
            disabled={isAddingCategory || !newCategoryName.trim()}
            className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-bold text-sm hover:bg-emerald-600 transition-colors disabled:opacity-50 w-full"
          >
            {isAddingCategory ? 'Saving...' : 'Create Category'}
          </button>
        </form>
      </div>
    </div>
  );

  const renderManageCategories = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <button onClick={() => setActiveView('hub')} className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary mb-6 transition-colors">
        <BackIcon className="w-4 h-4" /> Back to Hub
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-xl font-heading font-bold text-primary">Manage Categories</h2>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{categories.length} Tags</span>
        </div>
        <ul className="divide-y divide-gray-100">
          {categories.length === 0 ? (
            <li className="p-10 text-center text-gray-500 text-sm">No categories created yet.</li>
          ) : (
            categories.map(cat => (
              <li key={cat.id} className="p-5 px-6 flex justify-between items-center hover:bg-gray-50/50 transition-colors group">
                
                {/* INLINE EDIT MODE */}
                {editingCategoryId === cat.id ? (
                  <div className="flex items-center gap-3 w-full animate-in fade-in zoom-in-95 duration-200">
                    <input 
                      type="text" 
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      autoFocus
                      className="flex-1 bg-white border border-blue-500 rounded-lg px-4 py-2 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                    />
                    <button 
                      onClick={() => handleUpdateCategory(cat.id)} 
                      className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                      title="Save Category"
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setEditingCategoryId(null)} 
                      className="p-2.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Cancel"
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    {/* STANDARD DISPLAY MODE */}
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                          <TagIcon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-gray-800">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setEditingCategoryId(cat.id);
                          setEditingCategoryName(cat.name);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Category"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => triggerDeleteCategory(cat.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Category"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                )}

              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-heading font-black text-primary mb-2">Impact Pulse</h1>
        <p className="text-base text-gray-500 font-medium">Your control center for grassroots stories and documentaries.</p>
      </div>

      {activeView === 'hub' && renderHub()}
      {activeView === 'library' && renderLibrary()}
      {activeView === 'addCategory' && renderAddCategory()}
      {activeView === 'manageCategories' && renderManageCategories()}

      {/* Floating Bulk Action Bar */}
      {selectedPosts.length > 0 && activeView === 'library' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-8 z-40 border border-gray-700/50">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full text-xs font-bold text-white shadow-sm">
              {selectedPosts.length}
            </span>
            <span className="text-sm font-medium text-gray-100">Items Selected</span>
          </div>
          
          <div className="w-px h-6 bg-gray-700"></div>
          
          <button 
            onClick={triggerBulkDelete}
            className="flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300 transition-colors group"
          >
            <TrashIcon className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> Bulk Delete
          </button>
          
          <button 
            onClick={() => setSelectedPosts([])}
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
              {deleteModal.mode === 'content' ? 'Delete Post?' : 
               deleteModal.mode === 'bulk-content' ? `Delete ${selectedPosts.length} Posts?` : 
               'Delete Category?'}
            </h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              {deleteModal.mode === 'content' ? "Are you sure you want to delete this post? This action is permanent and cannot be undone." :
               deleteModal.mode === 'bulk-content' ? "Are you sure you want to delete all selected posts? This action is permanent and cannot be undone." :
               "Are you sure you want to delete this category? Any content currently using this tag will be marked as uncategorized."}
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