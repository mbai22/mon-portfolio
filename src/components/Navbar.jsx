import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSectionNav } from '../hooks/useSectionNav';

// `id` scrolls to a home-page section, `to` opens a separate page
const navLinks = [
  { name: 'Accueil', id: 'hero' },
  { name: 'À propos', id: 'about' },
  { name: 'Compétences', id: 'skills' },
  { name: 'Services', id: 'services' },
  { name: 'Portfolio', to: '/portfolio' },
  { name: 'Blog', id: 'blog' },
  { name: 'FAQ', id: 'faq' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const goTo = useSectionNav();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }, [isOpen]);

  const handleClick = (id) => (e) => {
    setIsOpen(false);
    goTo(id)(e);
  };

  const renderLink = (link, className) => (link.to ? (
    <NavLink key={link.name} to={link.to} onClick={() => setIsOpen(false)} className={className}>
      {link.name}
    </NavLink>
  ) : (
    <a key={link.name} href={`#${link.id}`} onClick={handleClick(link.id)} className={className}>
      {link.name}
    </a>
  ));

  return (
    <nav className={`navbar${scrolled || isOpen ? ' scrolled' : ''}`}>
      <div className="container navbar-inner">
        <a href="#hero" onClick={handleClick('hero')} className="navbar-logo">
          <img src="/assets/logo-hero.png" alt="WillyDev" />
        </a>

        <div className="navbar-links">
          {navLinks.map((link) => renderLink(link, 'navbar-link'))}
        </div>

        <a href="#contact" onClick={handleClick('contact')} className="navbar-cta">
          Me contacter
        </a>

        <button
          className="navbar-toggle"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className={`navbar-mobile${isOpen ? ' open' : ''}`}>
        {[...navLinks, { name: 'Contact', id: 'contact' }].map((link) => renderLink(link, 'navbar-mobile-link display'))}
      </div>
    </nav>
  );
}
