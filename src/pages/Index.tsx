
import Navbar from '@/components/navigation/Navbar';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import { ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const Index = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  
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
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Contact />
      
      {/* Footer */}
      <footer className="py-12 bg-primary text-primary-foreground">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-xl font-display font-medium tracking-tight">
                Blank<span className="opacity-80">Canvas</span>
              </div>
              <p className="text-primary-foreground/70 mt-2">
                Designed with precision. Built with care.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <div className="flex space-x-6 mb-4">
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300">
                  Terms
                </a>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300">
                  Privacy
                </a>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300">
                  Contact
                </a>
              </div>
              <p className="text-primary-foreground/60 text-sm">
                &copy; {new Date().getFullYear()} BlankCanvas. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-6 right-6 h-12 w-12 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary transition-all duration-300 ease-out z-40",
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
