import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

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

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  
  // Check if we are inside the Impact Pulse hub
  const isImpactPulse = location.pathname.includes('/impact-pulse')

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
      {/* 
        The outer wrapper is permanently white. 
        Added ease-in-out for a buttery smooth padding transition.
      */}
      <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center bg-white transition-all duration-500 ease-in-out ${isScrolled ? 'py-4 shadow-sm' : 'py-0 shadow-none'}`}>
        
        <nav 
          className={`flex justify-between items-center transition-all duration-500 ease-in-out
            ${isScrolled 
              ? 'w-[90%] max-w-5xl px-6 py-2.5 rounded-full shadow-lg bg-primary text-white' 
              : `w-full max-w-full px-6 md:px-10 py-4 rounded-none ${
                  isImpactPulse ? 'bg-primary text-white' : 'bg-white text-primary'
                }`
            } 
          `}
        >
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 drop-shadow-md hover:opacity-80 transition-opacity duration-300 z-50">
            <img src="/logo.png" alt="Rafiki Afrik Logo" className="w-7 h-7 md:w-9 md:h-9 object-contain" />
            <span className="font-heading font-bold text-lg md:text-xl tracking-wide">
              Rafiki <span className="text-secondary transition-colors duration-500 ease-in-out">Afrik</span>
            </span>
          </Link>

          {/* Navigation Links / Hamburger */}
          <div className="flex items-center z-50">
            {isImpactPulse ? (
              
              // IMPACT PULSE MODE: Show Hamburger (Desktop & Mobile)
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 transition-colors duration-300 hover:text-secondary"
              >
                {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>

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

      {/* Premium Full-Screen Menu Overlay (Fade & Gentle Slide) */}
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