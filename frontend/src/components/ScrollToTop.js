import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search, hash, state } = useLocation();

  // Prevent browser's automatic scroll restoration from interfering
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    // If navigating to home with a specific section target from Navbar,
    // allow Navbar's smooth scroll handler to take precedence
    if (state?.scrollToSection) {
      return;
    }

    // If an in-page anchor hash exists, allow default browser or component hash navigation
    if (hash) {
      return;
    }

    const resetToTop = () => {
      // 1. Reset Lenis smooth scroll instance immediately if active
      if (window.lenis) {
        try {
          window.lenis.scrollTo(0, { immediate: true });
        } catch (e) {
          // Lenis might be initializing or destroyed
        }
      }

      // 2. Reset window and document root scroll positions
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // 3. Reset any scrollable container parents if present
      const mainContent = document.querySelector('.main-content');
      if (mainContent) mainContent.scrollTop = 0;
      const appContainer = document.querySelector('.app-container');
      if (appContainer) appContainer.scrollTop = 0;
    };

    // Execute immediately before browser paint
    resetToTop();

    // Execute on the next animation frame
    const rafId = requestAnimationFrame(resetToTop);

    // Delayed fallback to handle async layout shifts, images, or third-party libraries
    const timer = setTimeout(() => {
      resetToTop();

      // Refresh AOS animation triggers so top-of-page elements reveal properly
      if (window.AOS && typeof window.AOS.refresh === 'function') {
        window.AOS.refresh();
      }

      // Refresh GSAP ScrollTrigger if present
      if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
        window.ScrollTrigger.refresh();
      }
    }, 60);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [pathname, search, hash, state]);

  return null;
};

export default ScrollToTop;
