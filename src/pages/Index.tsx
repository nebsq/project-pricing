
import { ChevronRight, ChevronUp, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const navigateToAuth = () => {
    navigate('/auth');
  };
  
  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
    } finally {
      setIsLoading(false);
    }
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
            
            {/* Sign In Section */}
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-display font-semibold text-foreground mb-6 text-center">
                Sign in to get started
              </h2>
              
              <div className="space-y-4">
                <Button 
                  onClick={signInWithGoogle}
                  disabled={isLoading}
                  className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-medium"
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path 
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                      fill="#4285F4" 
                    />
                    <path 
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                      fill="#34A853" 
                    />
                    <path 
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
                      fill="#FBBC05" 
                    />
                    <path 
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                      fill="#EA4335" 
                    />
                  </svg>
                  Sign in with Google
                </Button>
                
                <div className="flex items-center">
                  <Separator className="flex-1" />
                  <span className="px-3 text-sm text-gray-500">or</span>
                  <Separator className="flex-1" />
                </div>
                
                <Button 
                  onClick={navigateToAuth}
                  variant="outline"
                  className="w-full border-[#F97316] text-[#F97316] hover:bg-[#F97316]/5"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Continue with Email
                </Button>
              </div>
            </div>
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
