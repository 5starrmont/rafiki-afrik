import { Link } from 'react-router-dom'

export default function PodcastFeed() {
  return (
    <section className="py-20 px-6 bg-orange-50/30">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-primary mb-2">
              Latest Conversations
            </h2>
            <p className="text-gray-600 font-body text-lg">
              Tune into the Friends from Afrika podcast.
            </p>
          </div>
          <Link 
            to="/friends" 
            className="hidden md:inline-block text-secondary font-medium hover:underline"
          >
            View All Episodes &rarr;
          </Link>
        </div>

        {/* Podcast Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Hero Episode (Spans 2 columns on large screens) */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-2/5 bg-gray-200 h-64 md:h-auto flex items-center justify-center">
              <span className="text-gray-400 font-body text-sm">Cover Art Placeholder</span>
            </div>
            <div className="w-full md:w-3/5 p-8 flex flex-col justify-center">
              <span className="text-xs font-bold tracking-wider text-primary uppercase mb-2">Newest Episode</span>
              <h3 className="text-2xl font-heading font-semibold text-gray-900 mb-3">
                Building the Future of African Tech
              </h3>
              <p className="text-gray-600 font-body mb-6 line-clamp-3">
                In this episode, we sit down with leading innovators to discuss how grassroots technology is reshaping the economic landscape across the continent.
              </p>
              {/* Fake Audio Player Placeholder */}
              <div className="w-full h-12 bg-gray-100 rounded-full flex items-center px-4">
                <div className="w-8 h-8 bg-secondary rounded-full flex-shrink-0"></div>
                <div className="h-2 bg-gray-300 rounded-full w-full mx-4"></div>
                <span className="text-xs text-gray-500 font-body">00:00</span>
              </div>
            </div>
          </div>

          {/* Recent Episodes Column */}
          <div className="flex flex-col gap-8">
            
            {/* Small Card 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex items-center p-4">
              <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                <span className="text-gray-400 text-xs text-center px-1">Art</span>
              </div>
              <div className="ml-4">
                <h4 className="font-heading font-semibold text-gray-900 line-clamp-2 mb-1">
                  The Creative Economy's Rise
                </h4>
                <Link to="/friends" className="text-sm text-secondary font-medium hover:underline">
                  Listen Now
                </Link>
              </div>
            </div>

            {/* Small Card 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex items-center p-4">
              <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                <span className="text-gray-400 text-xs text-center px-1">Art</span>
              </div>
              <div className="ml-4">
                <h4 className="font-heading font-semibold text-gray-900 line-clamp-2 mb-1">
                  Redefining African Leadership
                </h4>
                <Link to="/friends" className="text-sm text-secondary font-medium hover:underline">
                  Listen Now
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 md:hidden text-center">
          <Link 
            to="/friends" 
            className="inline-block bg-white border border-gray-200 text-primary font-body font-medium px-6 py-3 rounded-md w-full"
          >
            View All Episodes
          </Link>
        </div>

      </div>
    </section>
  )
}