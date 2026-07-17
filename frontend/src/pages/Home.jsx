import { Link } from 'react-router-dom'
import Spotlight from '../components/Spotlight'
import AdvocacyChannel from '../components/AdvocacyChannel'
import PodcastFeed from '../components/PodcastFeed'
import ImpactPulseFeed from '../components/ImpactPulseFeed'
import ImpactCounters from '../components/ImpactCounters'
import Newsletter from '../components/Newsletter'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full min-h-[105vh] flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-[center_top_20%]"
          style={{ backgroundImage: `url('/dancing.jpeg')` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center mt-16">
          {/* Logo */}
          <img src="/logo.png" alt="Rafiki Afrik Logo" className="w-32 h-32 md:w-40 md:h-40 mb-6 object-contain drop-shadow-2xl" />
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 drop-shadow-md leading-tight">
            Amplifying African Voices Through Media
          </h1>
          <p className="text-lg md:text-xl font-body text-gray-200 mb-10 max-w-3xl drop-shadow-md leading-relaxed">
            Rafiki Afrik is a media advocacy platform dedicated to telling African stories that drive social change through podcasts, films, and digital content.
          </p>
          <Link 
            to="/friends" 
            className="bg-secondary hover:bg-[#e07d3b] text-white font-body font-medium px-8 py-4 rounded-full transition-all shadow-lg"
          >
            Join Friends from Afrika
          </Link>
        </div>
      </section>

      {/* Dynamic Spotlight Section */}
      <Spotlight />

      {/* Legacy Advocacy Channel */}
      <AdvocacyChannel />

      {/* Latest Podcast Feed */}
      <PodcastFeed />

      {/* Latest Impact Pulse Feed */}
      <ImpactPulseFeed />
      
      {/* Impact Statistics */}
      <ImpactCounters />

      {/* Newsletter Subscription */}
      <div className="px-6 mb-16">
        <Newsletter />
      </div>

    </div>
  )
}