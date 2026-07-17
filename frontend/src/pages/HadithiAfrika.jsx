import { useState, useEffect } from 'react'
import { contentAPI } from '../services/api'

export default function HadithiAfrika() {
  const [films, setFilms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await contentAPI.getFilms()
        setFilms(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching films:", error)
        setLoading(false)
      }
    }

    fetchFilms()
  }, [])

  return (
    <div className="bg-black min-h-screen text-white pb-24">
      
      {/* Cinematic Header */}
      <header className="py-24 px-6 text-center border-b border-gray-800 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest text-black uppercase bg-secondary rounded-full">
            Original Productions
          </span>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">Hadithi Afrika</h1>
          <p className="text-xl font-body text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Our original documentaries and cinematic portfolio exploring African identity, culture, and untold stories.
          </p>
        </div>
      </header>

      {/* Film Grid */}
      <main className="max-w-6xl mx-auto px-6 mt-16">
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-body animate-pulse">
            Loading films...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {films.map((film) => (
              <div key={film.id} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 flex flex-col group hover:border-gray-600 transition-colors">
                <div className="h-[400px] bg-gray-800 flex items-center justify-center relative overflow-hidden">
                  {film.poster_image ? (
                    <img 
                      src={film.poster_image} 
                      alt={film.title} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
                    />
                  ) : (
                    <span className="text-gray-500 font-body z-10">No Poster Available</span>
                  )}
                  {/* Subtle hover effect for the poster area */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-3xl font-heading font-bold text-white">{film.title}</h2>
                    <span className="text-sm font-body text-secondary border border-secondary px-3 py-1 rounded-full">
                      {film.release_year}
                    </span>
                  </div>
                  <p className="text-gray-400 font-body mb-8 leading-relaxed">
                    {film.description}
                  </p>
                  
                  <div className="mt-auto">
                    {film.video_url ? (
                      <a 
                        href={film.video_url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-secondary hover:bg-opacity-90 text-white font-medium px-8 py-4 rounded-md transition-all w-full md:w-auto shadow-lg"
                      >
                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" fillRule="evenodd"></path>
                        </svg>
                        Watch Full Film
                      </a>
                    ) : (
                      <span className="inline-flex items-center justify-center bg-gray-800 text-gray-500 font-medium px-8 py-4 rounded-md w-full md:w-auto cursor-not-allowed">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
      </main>
    </div>
  )
}