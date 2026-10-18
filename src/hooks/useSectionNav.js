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
      setTimeout(scroll, 100);
    }
  }, [navigate, pathname]);
}
