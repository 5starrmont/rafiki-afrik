export default function Services() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Page Header */}
      <header className="bg-tertiary text-white py-24 px-6 text-center border-b border-gray-800">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest text-black uppercase bg-secondary rounded-full">
            Work With Us
          </span>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">Our Services</h1>
          <p className="text-xl font-body text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Partner with Rafiki Afrik to amplify your impact, moderate high-level conversations, and collaborate on transformative media projects.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-20">
        
        {/* Overview Section */}
        <section className="mb-24 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-6">Bridging Narratives & Audiences</h2>
          <p className="text-gray-700 font-body text-lg leading-relaxed">
            We bridge the gap between grassroots narratives and global audiences. Whether you are an NGO looking to document your impact, a brand seeking authentic African stories, or an event organizer needing expert moderation, our team delivers excellence.
          </p>
        </section>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Partnership Opportunities */}
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-orange-50 text-secondary rounded-xl flex items-center justify-center mb-8 text-2xl">🤝</div>
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">Partnership Opportunities</h3>
            <p className="text-gray-600 font-body mb-10 flex-grow leading-relaxed">
              Align your brand with our mission. We offer strategic partnerships for our podcast series, documentary films, and community events to maximize reach and mutual impact.
            </p>
            <a 
              href="mailto:hello@rafikiafrik.africa" 
              className="inline-block text-center w-full bg-gray-50 hover:bg-gray-100 text-primary font-medium px-6 py-4 rounded-md transition-colors border border-gray-200"
            >
              Inquire About Partnerships
            </a>
          </div>

          {/* Collaborations */}
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-orange-50 text-secondary rounded-xl flex items-center justify-center mb-8 text-2xl">💡</div>
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">Collaborations</h3>
            <p className="text-gray-600 font-body mb-10 flex-grow leading-relaxed">
              Co-create with us. We work closely with independent creators, think tanks, and media houses to produce compelling articles, video stories, and analytical research.
            </p>
            <a 
              href="mailto:hello@rafikiafrik.africa" 
              className="inline-block text-center w-full bg-gray-50 hover:bg-gray-100 text-primary font-medium px-6 py-4 rounded-md transition-colors border border-gray-200"
            >
              Propose a Collaboration
            </a>
          </div>

          {/* Panel Moderation */}
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-orange-50 text-secondary rounded-xl flex items-center justify-center mb-8 text-2xl">🎤</div>
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">Panel Moderation</h3>
            <p className="text-gray-600 font-body mb-10 flex-grow leading-relaxed">
              Leverage our expertise in guiding high-level conversations. We provide professional moderation services for summits, conferences, and corporate events across the continent.
            </p>
            <a 
              href="mailto:hello@rafikiafrik.africa" 
              className="inline-block text-center w-full bg-gray-50 hover:bg-gray-100 text-primary font-medium px-6 py-4 rounded-md transition-colors border border-gray-200"
            >
              Book a Moderator
            </a>
          </div>

        </div>
      </main>
    </div>
  )
}