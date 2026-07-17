import { Link, useLocation, Outlet } from 'react-router-dom'

// Custom sleek SVGs
const DashboardIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>;
const FileTextIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const SettingsIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const HomeIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const FilmIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>;

export default function AdminLayout() {
  const location = useLocation()
  
  // Helper function to check if a link is active
  const isActive = (path) => {
    // Exact match for the admin home, otherwise check if URL starts with the path
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  }

  // Helper for styling active vs inactive links
  const linkStyle = (path) => `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
    isActive(path) 
      ? 'bg-primary/5 text-primary shadow-sm' 
      : 'text-gray-600 hover:bg-gray-50'
  }`;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex font-body">
      
      {/* ── Persistent Sidebar ── */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10 shadow-sm">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <Link to="/" className="font-heading font-black text-xl tracking-tight text-primary">
            Rafiki<span className="text-secondary">Admin.</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto">
          {/* Overview Section */}
          <div>
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Overview</p>
            <div className="space-y-1">
              <Link to="/admin" className={linkStyle('/admin')}>
                <HomeIcon className="w-4 h-4" /> Home Dashboard
              </Link>
            </div>
          </div>

          {/* Content Hubs Section */}
          <div>
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Content Hubs</p>
            <div className="space-y-1">
              <Link to="/admin/impact-pulse" className={linkStyle('/admin/impact-pulse')}>
                <DashboardIcon className="w-4 h-4" /> Impact Pulse
              </Link>
              <Link to="/admin/hadithi-afrika" className={linkStyle('/admin/hadithi-afrika')}>
                <FilmIcon className="w-4 h-4" /> Hadithi Afrika
              </Link>
            </div>
          </div>
          
          {/* System Section */}
          <div className="pt-4 border-t border-gray-100">
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">System</p>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm transition-all">
                <SettingsIcon className="w-4 h-4" /> Settings
              </button>
            </div>
          </div>
        </nav>
      </aside>

      {/* ── Dynamic Workspace ── */}
      {/* The margin-left keeps it pushed past the fixed sidebar */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Outlet is where React Router drops the specific page content */}
          <Outlet /> 
        </div>
      </main>
    </div>
  )
}