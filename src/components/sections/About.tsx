
import { useInView } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

const About = () => {
  const { ref, isInView } = useInView();
  
  const highlights = [
    'Premium user experience',
    'Thoughtful design details',
    'Fast performance',
    'Intuitive interface',
    'Responsive layout',
    'Modern design principles'
  ];
  
  return (
    <section id="about" className="py-24 overflow-hidden" ref={ref}>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Image/Visual Element */}
          <div 
            className={cn(
              "w-full lg:w-1/2 relative",
              isInView ? "opacity-100 transform-none" : "opacity-0 -translate-x-12",
              "transition-all duration-700 ease-out"
            )}
          >
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-gradient-to-br from-primary/5 to-accent/20 w-full h-full flex items-center justify-center">
                  <div className="w-3/4 h-3/4 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-display font-semibold tracking-tight text-primary mb-2">
                        Blank<span className="text-foreground">Canvas</span>
                      </div>
                      <div className="text-sm text-foreground/70">For design perfectionists</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-primary/10 rounded-xl"></div>
              <div className="absolute -left-6 -top-6 w-32 h-32 bg-accent/20 rounded-full blur-xl -z-10"></div>
            </div>
          </div>
          
          {/* Content */}
          <div 
            className={cn(
              "w-full lg:w-1/2",
              isInView ? "opacity-100 transform-none" : "opacity-0 translate-x-12",
              "transition-all duration-700 ease-out delay-300"
            )}
          >
            <span className="inline-block text-sm font-medium text-primary/90 mb-2">ABOUT US</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight text-foreground mb-6">
              Beyond Aesthetics
            </h2>
            <p className="text-lg text-foreground/80 mb-8">
              We believe great design is more than just how something looks—it's about
              how it works. Our approach combines minimalist aesthetics with intuitive
              functionality, creating experiences that are both beautiful and effortless to use.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {highlights.map((item, index) => (
                <div 
                  key={item} 
                  className={cn(
                    "flex items-center",
                    isInView ? "opacity-100 transform-none" : "opacity-0 translate-y-4",
                    "transition-all duration-500 ease-out",
                    {
                      "delay-400": index < 2,
                      "delay-500": index >= 2 && index < 4,
                      "delay-600": index >= 4
                    }
                  )}
                >
                  <CheckCircle size={18} className="text-primary mr-2 flex-shrink-0" />
                  <span className="text-foreground/90">{item}</span>
                </div>
              ))}
            </div>
            
            <blockquote 
              className={cn(
                "border-l-2 border-primary pl-4 italic text-foreground/80",
                isInView ? "opacity-100 transform-none" : "opacity-0 translate-y-4",
                "transition-all duration-500 ease-out delay-700"
              )}
            >
              "Design is not just what it looks like and feels like. Design is how it works."
              <footer className="mt-2 text-sm font-medium text-foreground">— Steve Jobs</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
