export default function About() {
  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* Page Header */}
      <header className="bg-primary text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">About Us</h1>
          <p className="text-xl font-body text-gray-200 max-w-2xl mx-auto">
            Amplifying African voices, ideas, innovation, and culture through powerful storytelling and community building.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-20 space-y-20">
        
        {/* Who We Are */}
        <section className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-heading font-bold text-primary mb-6">Who We Are</h2>
            <p className="text-gray-700 font-body leading-relaxed text-lg mb-4">
              Rafiki Afrik is a media advocacy organization and digital platform dedicated to reshaping the narrative surrounding the African continent. We believe that the stories of our people, our innovations, and our heritage deserve a global stage.
            </p>
            <p className="text-gray-700 font-body leading-relaxed text-lg">
              Through compelling articles, documentary films, and interactive community platforms, we connect changemakers and provide a microphone for the grassroots movements driving Africa forward.
            </p>
          </div>
          <div className="w-full md:w-1/2 h-80 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200 shadow-sm">
             <span className="text-gray-400 font-body">Team / Office Image Placeholder</span>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="bg-orange-50/50 p-10 rounded-2xl border border-orange-100">
            <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center mb-6 text-xl">🎯</div>
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">Our Mission</h2>
            <p className="text-gray-700 font-body leading-relaxed">
              To empower African creators, thinkers, and innovators by providing a robust digital ecosystem that archives our heritage and broadcasts our potential to the world.
            </p>
          </div>

          <div className="bg-orange-50/50 p-10 rounded-2xl border border-orange-100">
            <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center mb-6 text-xl">👁️</div>
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">Our Vision</h2>
            <p className="text-gray-700 font-body leading-relaxed">
              A united, globally recognized network where African identity is celebrated, our stories are owned by us, and our collective innovations drive tangible socioeconomic change.
            </p>
          </div>

        </section>

      </main>
    </div>
  )
}