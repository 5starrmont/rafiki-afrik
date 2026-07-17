import { useState } from 'react'
import PodcastFeed from '../components/PodcastFeed'

export default function Friends() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // This will eventually trigger your Django API POST request
    setIsSubmitted(true)
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* Page Header */}
      <header className="bg-tertiary text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest text-black uppercase bg-secondary rounded-full">
            The Movement
          </span>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
            Friends from Afrika
          </h1>
          <p className="text-xl font-body text-gray-300 max-w-2xl mx-auto leading-relaxed">
            A community bringing together Africans and friends of Africa to connect, learn, and collaborate through exclusive conversations and networking.
          </p>
        </div>
      </header>

      {/* Benefits Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="w-16 h-16 bg-orange-50 text-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🎙️</div>
            <h3 className="text-xl font-heading font-semibold text-primary mb-3">Exclusive Conversations</h3>
            <p className="text-gray-600 font-body">Gain access to off-the-record panels and Q&As with industry leaders across the continent.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-orange-50 text-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🤝</div>
            <h3 className="text-xl font-heading font-semibold text-primary mb-3">Networking & Collaboration</h3>
            <p className="text-gray-600 font-body">Connect with a vetted directory of professionals, founders, and creatives in the movement.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-orange-50 text-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🎟️</div>
            <h3 className="text-xl font-heading font-semibold text-primary mb-3">Community Events</h3>
            <p className="text-gray-600 font-body">Receive priority invitations to physical gatherings, workshops, and strategy sessions.</p>
          </div>
        </div>
      </section>

      {/* The Podcast Archive */}
      {/* We can reuse the PodcastFeed component here, or build a dedicated list later */}
      <PodcastFeed />

      {/* Waitlist Form Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white p-10 md:p-14 rounded-2xl shadow-sm border border-gray-100">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-heading font-bold text-primary mb-4">Join the Waiting List</h2>
            <p className="text-gray-600 font-body">
              Be the first to know when we open our next cohort. Fill out the details below to secure your spot.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-lg text-center">
              <h3 className="text-2xl font-heading font-semibold mb-2">You're on the list!</h3>
              <p className="font-body">Thank you for joining Friends from Afrika. We will be in touch soon with your next steps.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 font-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input type="email" required className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" placeholder="jane@example.com" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (Optional)</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" placeholder="+254 700 000000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" placeholder="Kenya" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization (Optional)</label>
                <input type="text" className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" placeholder="Company or NGO Name" />
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-tertiary text-white font-medium px-8 py-4 rounded-md transition-all shadow-md mt-4 text-lg"
              >
                Secure My Spot
              </button>
            </form>
          )}

        </div>
      </section>

    </div>
  )
}