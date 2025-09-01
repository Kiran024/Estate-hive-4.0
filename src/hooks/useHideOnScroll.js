import { useEffect, useRef, useState, useCallback } from 'react';

export default function useHideOnScroll({
  threshold = 50,        // minimum scroll before hiding
  topOffset = 10,        // always show near top
  tolerance = 3,         // ignore tiny scrolls
} = {}) {
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const getScrollY = useCallback(() => {
    return window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
  }, []);

  const updateScrollState = useCallback(() => {
    const currentScrollY = getScrollY();
    const difference = currentScrollY - lastScrollY.current;
    const absoluteDifference = Math.abs(difference);

    // Update scroll progress (0-1)
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(currentScrollY / maxScroll, 1) : 0;
    setScrollProgress(progress);

    // Update isScrolled state
    setIsScrolled(currentScrollY > topOffset);

    // Skip if scroll difference is within tolerance
    if (absoluteDifference < tolerance) {
      ticking.current = false;
      return;
    }

    // Immediate hide/show without delays
    if (currentScrollY > threshold) {
      if (difference > 0) {
        // Scrolling down - hide navbar immediately
        setHidden(true);
      } else if (difference < 0) {
        // Scrolling up - show navbar immediately
        setHidden(false);
      }
    } else {
      // Near top of page - always show
      setHidden(false);
    }

    lastScrollY.current = currentScrollY;
    ticking.current = false;
  }, [threshold, topOffset, tolerance, getScrollY]);

  const requestTick = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(updateScrollState);
      ticking.current = true;
    }
  }, [updateScrollState]);

  useEffect(() => {
    // Initialize scroll position
    lastScrollY.current = getScrollY();
    setIsScrolled(lastScrollY.current > topOffset);

    // Handle scroll events
    const handleScroll = () => {
      requestTick();
    };

    // Add passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also listen to resize events as they might affect scroll
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial check
    updateScrollState();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [topOffset, requestTick, updateScrollState, getScrollY]);

  return { 
    hidden, 
    isScrolled,
    scrollProgress,
    currentScrollY: lastScrollY.current
  };
}