import { Link } from 'react-router-dom'

export default function Spotlight() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Spotlight Media Placeholder */}
        <div className="w-full h-[400px] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden shadow-sm relative">
          <span className="text-gray-400 font-body">Featured Media Placeholder</span>
        </div>

        {/* Spotlight Content */}
        <div>
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-secondary uppercase bg-orange-50 rounded-full">
            Featured Spotlight
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-semibold text-primary mb-6 leading-tight">
            Dynamic Headline Goes Here
          </h2>
          <p className="text-gray-700 font-body mb-8 leading-relaxed text-lg">
            This section will eventually pull the most important piece of content directly from your database. Whether it is a new documentary, a flagship event, or a viral article, it takes center stage here.
          </p>
          <Link 
            to="/impact-pulse"
            className="inline-block bg-tertiary hover:bg-opacity-90 text-white font-body font-medium px-8 py-3 rounded-md transition-all shadow-sm"
          >
            Explore Content
          </Link>
        </div>
        
      </div>
    </section>
  )
}