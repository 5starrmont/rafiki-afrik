import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-tertiary text-white pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        
        {/* Brand & Newsletter */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-heading font-bold mb-4">Rafiki Afrik</h2>
          <p className="text-gray-300 font-body mb-6 max-w-sm">
            Join our newsletter to stay updated on the latest stories, films, and community events across the continent.
          </p>
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-3 rounded-md text-gray-900 font-body focus:outline-none focus:ring-2 focus:ring-secondary flex-grow"
              required
            />
            <button 
              type="submit" 
              className="bg-secondary hover:bg-opacity-90 font-medium px-6 py-3 rounded-md transition-all whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-heading font-semibold mb-4 text-secondary">Quick Links</h3>
          <ul className="space-y-3 font-body text-gray-300">
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/impact-pulse" className="hover:text-white transition-colors">Impact Pulse</Link></li>
            <li><Link to="/hadithi-afrika" className="hover:text-white transition-colors">Hadithi Afrika</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Work With Us</Link></li>
            <li><Link to="/friends" className="hover:text-white transition-colors">Friends from Afrika</Link></li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h3 className="text-lg font-heading font-semibold mb-4 text-secondary">Connect</h3>
          <ul className="space-y-3 font-body text-gray-300 mb-6">
            <li>hello@rafikiafrik.africa</li>
            <li>Nairobi, Kenya</li>
          </ul>
          <div className="flex gap-4">
            {/* Social Icons Placeholders */}
            <a href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-secondary transition-colors">
              <span className="sr-only">Twitter</span>
              <span className="text-xs">TW</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-secondary transition-colors">
              <span className="sr-only">LinkedIn</span>
              <span className="text-xs">LI</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-secondary transition-colors">
              <span className="sr-only">YouTube</span>
              <span className="text-xs">YT</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto pt-8 border-t border-primary text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 font-body text-sm">
        <p>&copy; {new Date().getFullYear()} Rafiki Afrik. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}