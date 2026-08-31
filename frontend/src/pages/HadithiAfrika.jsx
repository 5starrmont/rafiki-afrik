import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HadithiAfrika() {
  // Set Document Title
  useEffect(() => {
    document.title = "Hadithi Afrika | Rafiki Afrik";
  }, []);

  // Reusable watermark string
  const watermarkText = "A HADITHI AFRIKA PRODUCTION • A HADITHI AFRIKA PRODUCTION • A HADITHI AFRIKA PRODUCTION • A HADITHI AFRIKA PRODUCTION • A HADITHI AFRIKA PRODUCTION • A HADITHI AFRIKA PRODUCTION • ";

  return (
    <div className="bg-[#FDFCFB] min-h-screen font-body pb-24">
      
      {/* Brand Hero Header - Extra Trimmed */}
      <header className="relative pt-32 pb-16 bg-primary overflow-hidden px-6 flex flex-col justify-center min-h-[30vh]">
        
        {/* Radial Glow */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        
        {/* Cinematic Diagonal Watermarks */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none flex flex-col justify-center gap-12 z-0 scale-[1.35] transform -rotate-[8deg]">
          <div 
            className="font-heading font-black text-[35px] md:text-[55px] leading-none whitespace-nowrap text-transparent -translate-x-1/4"
            style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.08)' }}
          >
            {watermarkText}
          </div>
          <div 
            className="font-heading font-black text-[35px] md:text-[55px] leading-none whitespace-nowrap text-transparent translate-x-[-5%]"
            style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.08)' }}
          >
            {watermarkText}
          </div>
          <div 
            className="font-heading font-black text-[35px] md:text-[55px] leading-none whitespace-nowrap text-transparent -translate-x-1/3"
            style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.08)' }}
          >
            {watermarkText}
          </div>
          <div 
            className="font-heading font-black text-[35px] md:text-[55px] leading-none whitespace-nowrap text-transparent translate-x-[-12%]"
            style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.08)' }}
          >
            {watermarkText}
          </div>
          <div 
            className="font-heading font-black text-[35px] md:text-[55px] leading-none whitespace-nowrap text-transparent -translate-x-1/4"
            style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.08)' }}
          >
            {watermarkText}
          </div>
        </div>

        {/* Hero Content (Title Only) */}
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center mt-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white tracking-tight mb-4 drop-shadow-sm">
            Hadithi <span className="text-secondary">Afrika</span>
          </h1>
          
          <h2 className="text-lg md:text-2xl font-heading font-bold text-white/90 drop-shadow-sm">
            African Stories, African Voices
          </h2>
        </div>
      </header>

      {/* Intro Manifesto Section with Image */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Text Content */}
          <div className="w-full lg:w-1/2">
            <p className="text-2xl md:text-3xl text-primary font-heading font-bold mb-8 leading-tight">
              Simplifying societal challenges into relatable discussions that ignite dialogue and drive transformation from the grassroots level to legislative action.
            </p>
            
            <div className="text-gray-600 font-body text-[16px] md:text-[18px] leading-relaxed space-y-6 mb-10">
              <p>
                An innovative initiative designed to harness the power of film, storytelling, and media to foster social change across the African continent. By blending educational themes with entertaining narratives, we capture attention and make complex social issues relatable and engaging.
              </p>
              <p>
                Through compelling storytelling, Hadithi Afrika seeks to demystify challenging topics, transforming intricate subjects into relatable experiences that create an entry point for engagement, dialogue, and ongoing conversations.
              </p>
            </div>

            <Link 
              to="/hadithi-afrika/watch"
              className="inline-flex items-center justify-center bg-secondary text-white hover:bg-primary font-heading font-bold uppercase tracking-wider text-sm px-10 py-4 rounded-full transition-all duration-300 shadow-xl hover:-translate-y-1"
            >
              Explore Our Films
              <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {/* Right Image Layout */}
          <div className="w-full lg:w-1/2 relative group">
            <div className="absolute inset-0 bg-secondary/10 rounded-[2.5rem] transform rotate-3 scale-105 transition-transform duration-500 group-hover:rotate-6"></div>
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-100">
              <img 
                src="/hadithi_africa.jpeg" 
                alt="Hadithi Afrika Initiative" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}