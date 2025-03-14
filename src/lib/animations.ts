
import { useEffect, useState, useRef } from 'react';

// Hook for detecting when an element is in viewport
export function useInView() {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(currentRef);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    observer.observe(currentRef);
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return { ref, isInView };
}

// Hook for staggered animations
export function useStaggeredAnimation(itemCount: number, staggerDelay: number = 0.1) {
  return Array.from({ length: itemCount }).map((_, i) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { 
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      delay: i * staggerDelay 
    }
  }));
}

// Function to create scrolling parallax effect
export function createParallaxStyle(scrollY: number, element: HTMLElement | null, speed: number = 0.2) {
  if (!element) return {};
  const rect = element.getBoundingClientRect();
  const elementTop = rect.top + scrollY;
  const offset = (scrollY - elementTop) * speed;
  
  return {
    transform: `translateY(${offset}px)`,
  };
}

// Animated count hook
export function useAnimatedCount(targetValue: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;
    
    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      
      setCount(Math.floor(easedProgress * targetValue));
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      }
    };
    
    animationFrameId = requestAnimationFrame(updateCount);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetValue, duration]);
  
  return count;
}

// Easing function
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}
