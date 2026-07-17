import { Link } from 'react-router-dom'
import FloatingLines from './FloatingLines'

export default function AdvocacyChannel() {
  const channels = [
    {
      id: 'podcast',
      title: 'Friends from Africa 4 Africa Podcast',
      description: "Join us for insightful conversations with leading voices in Africa, discussing the challenges and opportunities that shape our continent's future.",
      link: '/friends',
      image: '/podcast.jpeg'
    },
    {
      id: 'hadithi',
      title: 'Hadithi Afrika',
      description: "Dive into our cinematic journey that explores Africa's rich identity and culture, showcasing powerful narratives that provoke thought and inspire action.",
      link: '/hadithi-afrika',
      image: '/hadithi_africa.jpeg'
    },
    {
      id: 'impact',
      title: 'Impact Pulse',
      description: "Discover the incredible stories of grassroots changemakers who are making a real difference in their communities through innovative solutions and relentless dedication.",
      link: '/impact-pulse',
      image: '/impact.jpeg'
    }
  ]

  return (
    // Explicitly forced pure bg-white here
    <section className="relative py-24 px-6 bg-white overflow-hidden">
      
      {/* Floating Lines 3D Background */}
      <div className="absolute inset-0 z-0">
        <FloatingLines
          linesGradient={['#e07d3b', '#fcd3b6', '#e07d3b']} 
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[6, 8, 10]} 
          lineDistance={[8, 6, 4]}
          
          // Interaction Tweaks for Smoothness
          bendRadius={6.0}         // Widened the area of influence
          bendStrength={-1.8}      // Smooth, sweeping bends
          mouseDamping={0.04}      // Lowered damping makes the lines glide and trail like silk
          interactive={true}
          parallax={true}
          parallaxStrength={0.3}   // Added a bit more 3D depth
          animationSpeed={0.8}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 pointer-events-none">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4 drop-shadow-sm">
            Our Advocacy Channels
          </h2>
          <div className="w-16 h-1 bg-secondary mx-auto"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {channels.map((channel) => (
            <div 
              key={channel.id} 
              className="pointer-events-auto flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="h-56 bg-gray-100 relative overflow-hidden border-b border-gray-200">
                <img 
                  src={channel.image} 
                  alt={channel.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-heading font-bold text-primary mb-3">
                  {channel.title}
                </h3>
                <p className="text-gray-600 font-body text-sm leading-relaxed mb-6 flex-grow">
                  {channel.description}
                </p>
                
                <div className="mt-auto">
                  <Link 
                    to={channel.link}
                    className="inline-flex items-center text-sm font-bold text-secondary hover:text-primary transition-colors uppercase tracking-wider"
                  >
                    Explore
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}