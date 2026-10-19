import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Returns a click handler factory that scrolls to a home-page section,
// navigating back to the home page first when needed.
export function useSectionNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useCallback((id) => (e) => {
    e?.preventDefault();
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    if (pathname === '/') {
      scroll();
    } else {
      navigate('/');
      // Wait for the home page to render (up to ~2 s) before scrolling
      let tries = 0;
      const waitForSection = () => {
        if (document.getElementById(id)) {
          requestAnimationFrame(scroll);
        } else if (tries++ < 120) {
          requestAnimationFrame(waitForSection);
        }
      };
      requestAnimationFrame(waitForSection);
    }
  }, [navigate, pathname]);
}
