import { Link } from 'react-router-dom';

// Premium SVG Icons
const XIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const YouTubeIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-20 pb-10 px-6 border-t border-white/10 relative overflow-hidden">
      {/* Subtle background glow to give it depth */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Newsletter (Takes up 5 columns on large screens) */}
          <div className="lg:col-span-5 lg:pr-10">
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="block mb-6">
              <img src="/logo.png" alt="Rafiki Afrik" className="h-10 w-auto brightness-0 invert" />
            </Link>
            <p className="text-white/70 font-body leading-relaxed mb-8 text-[15px] max-w-md">
              Join our newsletter to stay updated on the latest stories, films, and community events shaping the narrative across the continent.
            </p>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="px-6 py-3.5 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-secondary focus:bg-white/10 flex-grow font-body text-sm transition-all"
                required
              />
              <button 
                type="submit" 
                className="bg-secondary text-white font-heading font-bold text-sm uppercase tracking-wider px-8 py-3.5 rounded-full hover:bg-white hover:text-primary transition-colors whitespace-nowrap shadow-lg"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Quick Links (Takes up 3 columns) */}
          <div className="lg:col-span-3 lg:pl-8">
            <h3 className="text-sm font-heading font-bold uppercase tracking-widest text-secondary mb-6 flex items-center gap-3">
              <span className="w-4 h-px bg-secondary"></span> Navigation
            </h3>
            <ul className="space-y-4 font-body text-[15px]">
              <li><Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all">About Us</Link></li>
              <li><Link to="/impact-pulse" onClick={() => window.scrollTo(0, 0)} className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all">Impact Pulse</Link></li>
              <li><Link to="/hadithi-afrika" onClick={() => window.scrollTo(0, 0)} className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all">Hadithi Afrika</Link></li>
              <li><Link to="/services" onClick={() => window.scrollTo(0, 0)} className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all">Work With Us</Link></li>
              <li><Link to="/friends" onClick={() => window.scrollTo(0, 0)} className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all">Friends from Afrika</Link></li>
            </ul>
          </div>

          {/* Contact & Socials (Takes up 4 columns) */}
          <div className="lg:col-span-4">
            <h3 className="text-sm font-heading font-bold uppercase tracking-widest text-secondary mb-6 flex items-center gap-3">
              <span className="w-4 h-px bg-secondary"></span> Connect With Us
            </h3>
            <div className="space-y-4 font-body text-[15px] text-white/70 mb-8">
              <a href="mailto:hello@rafikiafrik.africa" className="flex items-center gap-3 hover:text-white transition-colors">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                hello@rafikiafrik.africa
              </a>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Nairobi, Kenya
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-secondary hover:border-secondary hover:text-white transition-all duration-300 group">
                <span className="sr-only">X (Twitter)</span>
                <XIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-secondary hover:border-secondary hover:text-white transition-all duration-300 group">
                <span className="sr-only">LinkedIn</span>
                <LinkedInIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://www.youtube.com/@RafikiAfrik" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-secondary hover:border-secondary hover:text-white transition-all duration-300 group">
                <span className="sr-only">YouTube</span>
                <YouTubeIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 font-body text-sm">
          <p>&copy; {new Date().getFullYear()} Rafiki Afrik. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}