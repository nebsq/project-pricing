
import { ChevronRight, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Index = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  
  // Track scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero section only */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-bl from-[#F97316]/20 to-transparent rounded-full blur-3xl opacity-70" />
          <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-[#F97316]/5 to-transparent rounded-full blur-3xl opacity-70" />
        </div>
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Small badge */}
            <div className="inline-flex items-center bg-[#F97316]/10 border border-[#F97316]/20 rounded-full px-3 py-1 text-sm font-medium text-[#F97316] mb-6">
              Pricing Calculator
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-display font-semibold tracking-tight text-foreground mb-6 leading-tight text-balance">
              inploi's pricing calculator
            </h1>
            
            {/* Subheading */}
            <p className="text-lg sm:text-xl text-foreground/80 mb-10 max-w-3xl text-balance">
              Create custom quotes with our interactive pricing tool
            </p>
            
            {/* CTA Button */}
            <button 
              onClick={navigateToDashboard}
              className="inline-flex items-center justify-center rounded-md text-white bg-[#F97316] hover:bg-[#F97316]/90 px-8 py-2.5 text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              Get Started
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 bg-[#F97316] text-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-xl font-display font-medium tracking-tight">
                inploi
              </div>
              <p className="text-white/80 mt-2">
                Pricing made simple
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <div className="flex space-x-6 mb-4">
                <a href="#" className="text-white/80 hover:text-white transition-colors duration-300">
                  Terms
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors duration-300">
                  Privacy
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors duration-300">
                  Contact
                </a>
              </div>
              <p className="text-white/70 text-sm">
                &copy; {new Date().getFullYear()} inploi. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-6 right-6 h-12 w-12 rounded-full bg-[#F97316]/90 text-white flex items-center justify-center shadow-md hover:bg-[#F97316] transition-all duration-300 ease-out z-40",
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
        aria-label="Scroll to top"
      >
        <ChevronUp size={20} />
      </button>
    </div>
  );
};

export default Index;
