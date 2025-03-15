import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import AnimatedButton from '../ui/AnimatedButton';
import { ChevronRight, Menu, X } from 'lucide-react';
import { HoldButton } from "@/components/ui/hold-button"

type NavItem = {
  name: string;
  href: string;
};

const navItems: NavItem[] = [
  { name: 'Features', href: '#features' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out',
        scrolled ? 'py-3 bg-white/90 backdrop-blur-md shadow-sm' : 'py-5 bg-transparent'
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center transition-opacity duration-300 ease-out hover:opacity-80">
            <span className="text-xl font-display font-medium tracking-tight">
              Blank<span className="text-primary/90">Canvas</span>
            </span>
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground/90 hover:text-foreground transition-colors duration-300 ease-out relative group"
              >
                {item.name}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </a>
            ))}
            <HoldButton />
          </div>
          
          {/* Call to Action Button */}
          <div className="hidden md:block">
            <AnimatedButton
              variant="primary"
              size="sm"
              href="#contact"
              icon={<ChevronRight size={16} />}
            >
              Get Started
            </AnimatedButton>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-md text-foreground/80 hover:bg-accent transition-colors duration-300 ease-out"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </div>
      
      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/98 backdrop-blur-sm md:hidden transition-all duration-300 ease-out',
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="flex flex-col gap-6 p-6 pt-24">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={closeMobileMenu}
              className="text-lg font-medium text-foreground/90 hover:text-foreground transition-colors duration-300 ease-out py-2 border-b border-border/50"
            >
              {item.name}
            </a>
          ))}
          
          <div className="mt-4">
            <AnimatedButton
              variant="primary"
              size="lg"
              href="#contact"
              icon={<ChevronRight size={18} />}
              fullWidth
              onClick={closeMobileMenu}
            >
              Get Started
            </AnimatedButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
