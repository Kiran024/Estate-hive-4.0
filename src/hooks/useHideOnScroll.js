import { useEffect, useRef, useState } from 'react';

export default function useHideOnScroll({
  topOffset = 0,      // always show near top
  tolerance = 8,      // ignore tiny scrolls
  minChangeMs = 200,  // debounce toggles
} = {}) {
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const lastY = useRef(0);
  const lastToggle = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY || 0;

    const onScroll = () => {
      const y = window.scrollY || 0;
      const delta = y - lastY.current;
      const now = performance.now();

      setIsScrolled(y > topOffset);

      if (Math.abs(delta) > tolerance && now - lastToggle.current > minChangeMs) {
        if (delta > 0 && !hidden) {
          setHidden(true);
          lastToggle.current = now;
        } else if (delta < 0 && hidden) {
          setHidden(false);
          lastToggle.current = now;
        }
      }

      lastY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hidden, topOffset, tolerance, minChangeMs]);

  return { hidden, isScrolled };
}