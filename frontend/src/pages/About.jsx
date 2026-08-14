import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Precision Timeline Typewriter Component
const TypewriterText = ({ text, typeStart, eraseStart, delay = 25, cycle }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Stop and clear if section is out of view
    if (cycle === 0) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    let isCancelled = false;
    let timeoutIds = [];

    const schedule = (callback, time) => {
      const id = setTimeout(() => {
        if (!isCancelled) callback();
      }, time);
      timeoutIds.push(id);
    };

    // Reset at the start of every master cycle
    setDisplayedText('');
    setIsTyping(false);

    // 1. Schedule Typing Phase
    schedule(() => {
      setIsTyping(true);
      for (let i = 0; i < text.length; i++) {
        schedule(() => {
          setDisplayedText(text.substring(0, i + 1));
          if (i === text.length - 1) setIsTyping(false); // Stop blinking when done
        }, i * delay);
      }
    }, typeStart);

    // 2. Schedule Erasing Phase
    schedule(() => {
      setIsTyping(true);
      for (let i = 0; i < text.length; i++) {
        schedule(() => {
          setDisplayedText(text.substring(0, text.length - 1 - i));
          if (i === text.length - 1) setIsTyping(false);
        }, i * delay);
      }
    }, eraseStart);

    return () => {
      isCancelled = true;
      timeoutIds.forEach(clearTimeout);
    };
  }, [cycle, text, typeStart, eraseStart, delay]);

  return (
    <span ref={ref}>
      {displayedText}
      {/* Blinking Cursor */}
      <span className={`inline-block w-[3px] h-[0.8em] bg-secondary ml-1 align-middle transition-opacity duration-100 ${isTyping ? 'opacity-100 animate-pulse' : 'opacity-0 hidden'}`}></span>
    </span>
  );
};

export default function About() {
  // Master Clock State
  const [syncCycle, setSyncCycle] = useState(0);
  const sectionRef = useRef(null);
  
  // Set Browser Title & Setup Intersection Observer
  useEffect(() => {
    document.title = "About Us | Rafiki Afrik";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSyncCycle(1); // Start the cycle
        } else {
          setSyncCycle(0); // Pause and reset when hidden
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Strict 12-second Master Metronome
  useEffect(() => {
    let interval;
    if (syncCycle > 0) {
      interval = setInterval(() => {
        setSyncCycle(prev => prev + 1);
      }, 12000); 
    }
    return () => clearInterval(interval);
  }, [syncCycle]);

  return (
    <div className="bg-[#FDFCFB] min-h-screen pb-10 font-body">

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-heading font-black text-white tracking-tight mb-6">
            About <span className="text-secondary">Us</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-medium">
            Authentic stories. Unfiltered voices. Real impact.
          </p>
        </div>
      </header>

      {/* Who We Are Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          <div className="w-full lg:w-1/2 relative group">
            <div className="absolute inset-0 bg-secondary/20 rounded-[2.5rem] transform -rotate-3 scale-105 transition-transform duration-500 group-hover:-rotate-6"></div>
            <img
              src="/images/about/Who we are.jpeg"
              alt="Lynn Obwoge and Dorcas Omole"
              className="relative w-full aspect-[4/3] object-cover rounded-[2.5rem] shadow-2xl z-10"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary mb-3">Know Us</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-black text-primary mb-8 leading-tight tracking-tight">
              Who We Are
            </h3>
            <div className="space-y-5 text-gray-600 text-[17px] leading-[1.8]">
              <p>
                Rafiki Afrik is the heartbeat of bold storytelling, founded by two visionary young African women Lynn Obwoge and Dorcas Omole whose roots in Journalism, Applied Communication and development space fuel their passion for media-driven social change.
              </p>
              <p>
                We don't just tell stories we live them, listen to them, and lift them. At Rafiki Afrik, we blend local knowledge, real data, and compelling narratives to spotlight the issues that matter most. From the forgotten corners of rural villages to the buzzing streets of cities, we amplify community voices and bring raw, authentic experiences to the forefront.
              </p>
              <p>
                Our approach is fearless, creative, and intentional. By weaving together evidence-based content with captivating films, digital campaigns, and advocacy strategies, we spark conversations that challenge the status quo, influence public discourse, and inspire collective action across Africa.
              </p>
              <p className="font-bold text-primary text-xl mt-8 font-heading">
                Rafiki Afrik is more than a media advocacy company — it's a movement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Precision Choreographed Animation */}
      <section ref={sectionRef} className="py-24 border-y border-gray-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            
            {/* Vision Statement (Types First, Erases Last) */}
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-secondary w-8"></div>
                <span className="text-secondary font-bold uppercase tracking-widest text-xs">Our Vision</span>
              </div>
              <div className="relative">
                {/* Invisible structural placeholder */}
                <h3 className="invisible text-3xl md:text-4xl lg:text-5xl font-heading font-black leading-[1.2] tracking-tight pointer-events-none select-none">
                  Create Conversations<br/>Impact Change.
                </h3>
                {/* Absolute positioned typing text */}
                <h3 className="absolute top-0 left-0 w-full text-3xl md:text-4xl lg:text-5xl font-heading font-black leading-[1.2] tracking-tight text-gray-400">
                  <TypewriterText 
                    cycle={syncCycle}
                    text="Create Conversations" 
                    typeStart={200}    // Starts at 0.2s
                    eraseStart={10300} // Erases at 10.3s (very last)
                  />
                  <br/> 
                  <span className="text-primary">
                    <TypewriterText 
                      cycle={syncCycle}
                      text="Impact Change." 
                      typeStart={800}    // Starts at 0.8s
                      eraseStart={9800}  // Erases at 9.8s
                    />
                  </span>
                </h3>
              </div>
            </div>

            {/* Mission Statement (Types Second, Erases First) */}
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-secondary w-8"></div>
                <span className="text-secondary font-bold uppercase tracking-widest text-xs">Our Mission</span>
              </div>
              <div className="relative">
                {/* Invisible structural placeholder */}
                <h3 className="invisible text-3xl md:text-4xl lg:text-5xl font-heading font-black leading-[1.2] tracking-tight pointer-events-none select-none">
                  Implement media initiatives that address social issues and promote social responsibility.
                </h3>
                {/* Absolute positioned typing text */}
                <h3 className="absolute top-0 left-0 w-full text-3xl md:text-4xl lg:text-5xl font-heading font-black text-primary leading-[1.2] tracking-tight">
                  <TypewriterText 
                    cycle={syncCycle}
                    text="Implement media initiatives that address social issues and promote social responsibility." 
                    typeStart={1500}   // Starts at 1.5s
                    eraseStart={7000}  // Erases at 7.0s (first to disappear)
                  />
                </h3>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Collaborative Impact - Borderless Magazine Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-primary tracking-tight mb-4">Collaborative<br/>Impact.</h2>
            <div className="w-16 h-1.5 bg-secondary rounded-full"></div>
          </div>
          <p className="text-gray-500 font-medium max-w-sm text-sm md:text-base leading-relaxed">
            Partnering with communities, global networks, and cultural institutions to amplify African narratives worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16 mb-20">
          {[
            {
              title: 'Community Initiatives',
              desc: 'We partner with local organizations to support grassroots initiatives that drive social change. By collaborating with those directly impacted, we ensure that our efforts are relevant and effective.',
              img: '/images/about/comunity.jpeg'
            },
            {
              title: 'Global Networks',
              desc: 'We engage with international organizations to share knowledge, resources, and best practices. These partnerships amplify our message globally and connect us with changemakers.',
              img: '/images/about/Global Networks.jpeg'
            },
            {
              title: 'Cultural Collaborations',
              desc: "Our partnerships with cultural institutions allow us to explore and celebrate Africa's rich heritage. Together, we showcase the stories and talents that define our continent's identity.",
              img: '/images/about/cultural.jpeg'
            }
          ].map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden mb-6 bg-gray-100">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-2xl font-heading font-black text-primary mb-3 group-hover:text-secondary transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Premium CTA Section */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="relative rounded-[3rem] overflow-hidden bg-primary shadow-2xl group">
          {/* Abstract Background Elements */}
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-primary to-primary"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          
          {/* Content */}
          <div className="relative z-10 px-8 py-20 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-secondary"></span> The Movement
              </h2>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white leading-[1.1] tracking-tight mb-6">
                Join Friends From <br/> <span className="text-secondary">Afrika For Afrika.</span>
              </h3>
              <p className="text-white/80 font-medium text-lg leading-relaxed max-w-xl">
                Become part of a global network of storytellers, innovators, and changemakers actively shaping the narrative and future of African media.
              </p>
            </div>
            
            {/* Oversized Interactive Circular Button */}
            <div className="flex-shrink-0">
              <Link 
                to="/friends" 
                onClick={() => window.scrollTo(0, 0)}
                className="relative inline-flex items-center justify-center w-40 h-40 rounded-full bg-secondary text-white font-heading font-black text-lg uppercase tracking-wider overflow-hidden group/btn hover:scale-105 transition-transform duration-500 shadow-xl"
              >
                <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                <span className="relative z-10 flex flex-col items-center gap-2 group-hover/btn:text-primary transition-colors duration-500">
                  Join Us
                  <svg className="w-6 h-6 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
              </Link>
            </div>
          </div>
          
          {/* Massive watermark text */}
          <div className="absolute -bottom-6 left-8 text-[60px] md:text-[100px] font-heading font-black text-white/[0.03] whitespace-nowrap pointer-events-none select-none">
            #FromAfrika4Afrika
          </div>
        </div>
      </section>

    </div>
  )
}