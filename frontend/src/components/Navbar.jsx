import { useState, useEffect } from 'react'
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom'

// Minimalist Menu Icons
const MenuIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  
  // Search Params for Hadithi Afrika Watch page
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Determine Layout Modes
  const isImpactPulse = location.pathname.includes('/impact-pulse')
  const isWatchPage = location.pathname.includes('/hadithi-afrika/watch')
  const isPodcasts = location.pathname.includes('/podcasts')
  
  // Specific checks for podcast views
  const isPodcastReader = location.pathname.startsWith('/podcasts/') && location.pathname !== '/podcasts' && location.pathname !== '/podcasts/';
  const isPodcastsLibrary = location.pathname === '/podcasts' || location.pathname === '/podcasts/';
  
  const isCollapsedMode = isImpactPulse || isWatchPage || isPodcasts

  // Generate an array of recent years for the dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close the menu automatically when navigating to a new page
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  const handleSearch = (e) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newParams.set('q', e.target.value)
    } else {
      newParams.delete('q')
    }
    setSearchParams(newParams)
  }

  const handleYearChange = (e) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newParams.set('year', e.target.value)
    } else {
      newParams.delete('year')
    }
    setSearchParams(newParams)
  }

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Impact Pulse', path: '/impact-pulse' },
    { name: 'Hadithi Afrika', path: '/hadithi-afrika' },
    { name: 'Services', path: '/services' },
    { name: 'Friends', path: '/friends' },
  ]

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-in-out ${
        isWatchPage 
          ? 'bg-transparent py-0 shadow-none' 
          : (isPodcastReader || isPodcastsLibrary)
            ? 'py-0 shadow-sm backdrop-blur-md transition-colors duration-500 bg-white/95' 
            : `bg-white ${isScrolled ? 'py-4 shadow-sm' : 'py-0 shadow-none'}`
      }`}>
        
        <nav 
          className={`flex justify-between items-center transition-all duration-500 ease-in-out
            ${isWatchPage
              ? 'w-full max-w-full px-6 md:px-10 py-4 text-white rounded-none bg-transparent'
              : (isPodcastReader || isPodcastsLibrary)
                ? 'w-full max-w-full px-6 md:px-10 py-4 rounded-none transition-colors duration-500 text-primary'
                : (isScrolled 
                    ? 'w-[90%] max-w-5xl px-6 py-2.5 rounded-full shadow-lg bg-primary text-white' 
                    : `w-full max-w-full px-6 md:px-10 py-4 rounded-none ${
                        isImpactPulse ? 'bg-primary text-white' : 'bg-white text-primary'
                      }`
                  )
            } 
          `}
        >
          {/* Brand Logo & Name Area with Dynamic Back Button */}
          <div className="flex items-center z-50">
            {(isWatchPage || isPodcastReader || isPodcastsLibrary) && (
              <button 
                onClick={() => {
                  // If there is browser history within the app, pop it to restore scroll position naturally.
                  // If they opened the link directly in a new tab (no history), fall back to exact routes.
                  if (window.history.length > 2) {
                    navigate(-1);
                  } else {
                    if (isPodcastsLibrary) navigate('/');
                    else if (isPodcastReader) navigate('/podcasts');
                    else navigate('/hadithi-afrika');
                  }
                }}
                className={`p-1 md:p-2 transition-colors -ml-4 md:-ml-8 mr-2 md:mr-4 ${
                  isWatchPage ? 'text-white/70 hover:text-white' : 'opacity-70 hover:opacity-100'
                }`}
                title="Go Back"
              >
                <ArrowLeftIcon className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}
            
            <Link to={isPodcastReader ? "/podcasts" : (isWatchPage ? "/hadithi-afrika" : "/")} className="flex items-center gap-3 drop-shadow-md hover:opacity-80 transition-opacity duration-300">
              <img src="/logo.png" alt="Rafiki Afrik Logo" className="w-7 h-7 md:w-9 md:h-9 object-contain" />
              
              <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden flex items-center ${
                  (isWatchPage || isPodcastReader || isPodcastsLibrary) && isScrolled ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
                }`}
              >
                <span className="font-heading font-bold text-lg md:text-xl tracking-wide whitespace-nowrap">
                  {isWatchPage ? 'Hadithi' : 'Rafiki'} <span className="text-secondary transition-colors duration-500 ease-in-out">{isWatchPage ? 'Afrika' : 'Afrik'}</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links / Hamburger */}
          <div className="flex items-center z-50">
            {isCollapsedMode ? (
              
              // COLLAPSED MODE: Show Hamburger (and Search/Filters if Watch page)
              <div className="flex items-center gap-2 md:gap-4">
                
                {isWatchPage && (
                  <div className="flex items-center gap-2">
                    {/* Year Filter Dropdown */}
                    <div className="relative hidden sm:block">
                      <select 
                        value={searchParams.get('year') || ''}
                        onChange={handleYearChange}
                        className="appearance-none pl-4 pr-8 py-1.5 md:py-2 bg-white/10 border border-white/20 rounded-full text-white text-xs md:text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors cursor-pointer backdrop-blur-md"
                      >
                        <option value="" className="bg-primary text-white">All Years</option>
                        {years.map(year => (
                          <option key={year} value={year} className="bg-primary text-white">{year}</option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/60 pointer-events-none" />
                    </div>

                    {/* Search Input */}
                    <div className="relative w-36 sm:w-48 md:w-64 transition-all duration-300">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                      <input 
                        type="text" 
                        placeholder="Search films..." 
                        value={searchParams.get('q') || ''}
                        onChange={handleSearch}
                        className="w-full pl-9 pr-4 py-1.5 md:py-2 bg-white/10 border border-white/20 rounded-full text-white text-xs md:text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors placeholder:text-white/60 backdrop-blur-md"
                      />
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 transition-colors duration-300 hover:text-secondary"
                >
                  {isMenuOpen ? <CloseIcon className="w-6 h-6 md:w-7 md:h-7" /> : <MenuIcon className="w-6 h-6 md:w-7 md:h-7" />}
                </button>
              </div>

            ) : (
              
              // STANDARD MODE
              <>
                <div className="hidden md:flex gap-6 font-body font-medium drop-shadow-md text-sm">
                  {links.map((link) => (
                    <Link 
                      key={link.name} 
                      to={link.path} 
                      className="hover:text-secondary transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                
                {/* Standard Mode Mobile Hamburger */}
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 transition-colors duration-300 hover:text-secondary"
                >
                  {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Premium Full-Screen Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-primary/95 backdrop-blur-md z-40 transition-all duration-500 ease-in-out flex flex-col items-center justify-center ${
          isMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-8'
        }`}
      >
        <div className="flex flex-col gap-8 text-center">
          {links.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className="text-white font-heading font-black text-3xl md:text-5xl hover:text-secondary transition-colors duration-300 tracking-tight"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}