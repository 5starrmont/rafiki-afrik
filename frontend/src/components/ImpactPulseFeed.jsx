import { Link } from 'react-router-dom'

export default function ImpactPulseFeed() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-primary mb-2">
              Latest from Impact Pulse
            </h2>
            <p className="text-gray-600 font-body text-lg">
              Stories, insights, and videos amplifying African voices.
            </p>
          </div>
          <Link 
            to="/impact-pulse" 
            className="hidden md:inline-block text-secondary font-medium hover:underline"
          >
            View All Content &rarr;
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Article Card 1 */}
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Image Placeholder</span>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Business</span>
              <h3 className="font-heading font-semibold text-xl text-gray-900 mb-2 line-clamp-2">
                The Rise of Digital Trade Across Borders
              </h3>
              <p className="text-gray-600 text-sm font-body mb-4 line-clamp-3">
                Exploring how young entrepreneurs are leveraging new continental trade agreements to scale their tech startups.
              </p>
              <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-400 font-body">Oct 12, 2026</span>
                <Link to="/impact-pulse" className="text-sm text-primary font-medium hover:underline">Read More</Link>
              </div>
            </div>
          </div>

          {/* Video Card 1 */}
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="h-48 bg-gray-800 relative flex items-center justify-center group cursor-pointer">
              <span className="text-gray-400 text-sm">Thumbnail Placeholder</span>
              {/* Play Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-secondary border-b-[8px] border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Culture</span>
              <h3 className="font-heading font-semibold text-xl text-gray-900 mb-2 line-clamp-2">
                Nairobi Urban Grandmothers
              </h3>
              <p className="text-gray-600 text-sm font-body mb-4 line-clamp-2">
                A short documentary looking at the shifting roles of elders in rapid urbanization.
              </p>
              <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-400 font-body">Oct 10, 2026</span>
                <a href="#" className="text-sm text-secondary font-medium hover:underline">Watch Now</a>
              </div>
            </div>
          </div>

          {/* Article Card 2 */}
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Image Placeholder</span>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Innovation</span>
              <h3 className="font-heading font-semibold text-xl text-gray-900 mb-2 line-clamp-2">
                Building Sovereign AI Models
              </h3>
              <p className="text-gray-600 text-sm font-body mb-4 line-clamp-3">
                Why localized data sets are critical for the next wave of artificial intelligence development in Africa.
              </p>
              <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-400 font-body">Oct 05, 2026</span>
                <Link to="/impact-pulse" className="text-sm text-primary font-medium hover:underline">Read More</Link>
              </div>
            </div>
          </div>

           {/* Video Card 2 */}
           <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="h-48 bg-gray-800 relative flex items-center justify-center group cursor-pointer">
              <span className="text-gray-400 text-sm">Thumbnail Placeholder</span>
              {/* Play Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-secondary border-b-[8px] border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Identity</span>
              <h3 className="font-heading font-semibold text-xl text-gray-900 mb-2 line-clamp-2">
                The Beauty of African Skin Recap
              </h3>
              <p className="text-gray-600 text-sm font-body mb-4 line-clamp-2">
                Highlights from our recent panel discussing the cultural significance of natural beauty.
              </p>
              <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-400 font-body">Sep 28, 2026</span>
                <a href="#" className="text-sm text-secondary font-medium hover:underline">Watch Now</a>
              </div>
            </div>
          </div>

        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 md:hidden text-center">
          <Link 
            to="/impact-pulse" 
            className="inline-block bg-white border border-gray-200 text-primary font-body font-medium px-6 py-3 rounded-md w-full"
          >
            View All Content
          </Link>
        </div>

      </div>
    </section>
  )
}