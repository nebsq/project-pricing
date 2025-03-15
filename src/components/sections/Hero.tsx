
import { useEffect, useRef, useState } from 'react';
import AnimatedButton from '../ui/AnimatedButton';
import { useInView } from '@/lib/animations';
import { ChevronRight, ArrowDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero = () => {
  const { ref: inViewRef, isInView } = useInView();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Handle mouse movement for subtle parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Calculate subtle parallax movement
  const getTransform = (depth: number = 1) => {
    const moveX = (mousePosition.x - 0.5) * depth * 20;
    const moveY = (mousePosition.y - 0.5) * depth * 20;
    return `translate(${moveX}px, ${moveY}px)`;
  };
  
  const handleScrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section
      ref={heroRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-bl from-accent/20 to-transparent rounded-full blur-3xl opacity-70"
          style={{ transform: getTransform(0.5) }}
        />
        <div 
          className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl opacity-70"
          style={{ transform: getTransform(0.3) }}
        />
      </div>
      
      <div 
        className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20"
      >
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Small badge */}
          <div 
            className={cn(
              "inline-flex items-center bg-primary/5 border border-primary/10 rounded-full px-3 py-1 text-xs font-medium text-primary/90 mb-6 transition-all duration-700 ease-out",
              isInView ? "opacity-100 transform-none" : "opacity-0 translate-y-4"
            )}
          >
            <Sparkles size={14} className="mr-1.5 text-primary/70" />
            Thoughtfully Designed
          </div>
          
          {/* Headline */}
          <h1 
            className={cn(
              "text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-display font-semibold tracking-tight text-foreground mb-6 leading-tight text-balance",
              isInView ? "opacity-100 transform-none" : "opacity-0 translate-y-6",
              "transition-all duration-700 delay-150 ease-out"
            )}
            ref={inViewRef as React.RefObject<HTMLHeadingElement>}
          >
            Create Beautiful Experiences With Minimal Design
          </h1>
          
          {/* Subheading */}
          <p 
            className={cn(
              "text-lg sm:text-xl text-foreground/80 mb-10 max-w-3xl text-balance",
              isInView ? "opacity-100 transform-none" : "opacity-0 translate-y-8",
              "transition-all duration-700 delay-300 ease-out"
            )}
          >
            A clean, elegant framework for building premium user experiences that prioritize simplicity, 
            functionality, and attention to detail.
          </p>
          
          {/* CTA Buttons */}
          <div 
            className={cn(
              "flex flex-col sm:flex-row items-center gap-4 mb-16",
              isInView ? "opacity-100 transform-none" : "opacity-0 translate-y-8",
              "transition-all duration-700 delay-500 ease-out"
            )}
          >
            <AnimatedButton 
              variant="primary" 
              size="lg"
              href="#contact"
              icon={<ChevronRight size={16} />}
              className="px-8"
            >
              Get Started
            </AnimatedButton>
            
            <AnimatedButton 
              variant="outline" 
              size="lg"
              href="#features"
              className="px-8"
            >
              Learn More
            </AnimatedButton>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div 
          className={cn(
            "absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer",
            isInView ? "opacity-100 transform-none" : "opacity-0 translate-y-4",
            "transition-all duration-700 delay-700 ease-out"
          )}
          onClick={handleScrollToFeatures}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs text-foreground/70 mb-2">Scroll to explore</span>
            <ArrowDown size={20} className="text-primary animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
