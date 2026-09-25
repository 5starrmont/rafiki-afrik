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
      <section className="relative w-full min-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Background Image - Anchored lower to push the image up and hide faces */}
        <div 
          className="absolute inset-0 bg-cover bg-[center_80%]"
          style={{ backgroundImage: `url('/dancing.jpeg')` }}
        >
          {/* Brown Overlay matching the legacy site */}
          <div className="absolute inset-0 bg-[#9A4C1C]/80"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center mt-16">
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
            Join Friends from Afrika for Afrika
          </Link>
        </div>
      </section>

      {/* 
        Dynamic Sections Wrapped with Min-Heights 
        This reserves space on the screen while data fetches to prevent Cumulative Layout Shift (CLS) 
        and ensures the Back button scroll restoration lands exactly where you left off.
      */}
      
      <div className="min-h-[500px] w-full">
        <Spotlight />
      </div>

      <div className="min-h-[400px] w-full">
        <AdvocacyChannel />
      </div>

      <div className="min-h-[600px] w-full">
        <ImpactPulseFeed />
      </div>

      <div className="min-h-[600px] w-full">
        <PodcastFeed />
      </div>
      
      <div className="min-h-[300px] w-full">
        <ImpactCounters />
      </div>

      {/* Newsletter Subscription */}
      <div className="px-6 mb-16 min-h-[300px]">
        <Newsletter />
      </div>

    </div>
  )
}