import { useCallback } from 'react';

/**
 * Custom hook for consistent scroll to top functionality
 * @param {Object} options - Configuration options
 * @param {string} options.behavior - Scroll behavior ('instant' | 'smooth' | 'auto')
 * @param {number} options.delay - Delay in milliseconds before scrolling
 * @returns {Function} scrollToTop function
 */
export const useScrollToTop = (options = {}) => {
  const { behavior = 'instant', delay = 0 } = options;

  const scrollToTop = useCallback((customOptions = {}) => {
    const scrollOptions = { ...options, ...customOptions };
    
    const performScroll = () => {
      try {
        // Multiple methods to ensure compatibility across all browsers and scenarios
        
        // Method 1: Modern browsers with options
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: scrollOptions.behavior || behavior
        });
        
        // Method 2: Direct property setting for immediate effect
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // Method 3: Legacy support
        if (window.pageYOffset !== 0) {
          window.pageYOffset = 0;
        }
        
        // Method 4: Force scroll for edge cases
        requestAnimationFrame(() => {
          if (window.scrollY > 0) {
            window.scrollTo(0, 0);
          }
        });
        
        // Method 5: Reset main content area
        const mainElement = document.querySelector('main');
        if (mainElement && mainElement.scrollTop > 0) {
          mainElement.scrollTop = 0;
        }
        
      } catch (error) {
        console.warn('ScrollToTop error:', error);
        // Ultimate fallback
        try {
          window.scroll(0, 0);
        } catch (fallbackError) {
          console.warn('ScrollToTop ultimate fallback error:', fallbackError);
        }
      }
    };

    if (delay > 0) {
      setTimeout(performScroll, delay);
    } else {
      performScroll();
    }
  }, [behavior, delay]);

  return scrollToTop;
};

/**
 * Simple scroll to top utility function
 * @param {Object} options - Scroll options
 */
export const scrollToTop = (options = {}) => {
  const { behavior = 'instant', delay = 0 } = options;
  
  const performScroll = () => {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior
      });
      
      // Fallback methods
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Ensure it worked
      requestAnimationFrame(() => {
        if (window.scrollY > 0) {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      });
      
    } catch (error) {
      console.warn('ScrollToTop utility error:', error);
      try {
        window.scroll(0, 0);
      } catch (fallbackError) {
        console.warn('ScrollToTop utility fallback error:', fallbackError);
      }
    }
  };

  if (delay > 0) {
    setTimeout(performScroll, delay);
  } else {
    performScroll();
  }
};

export default useScrollToTop;