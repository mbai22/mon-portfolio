import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useSectionNav } from '../hooks/useSectionNav';

const navLinks = [
  { name: 'Accueil', id: 'hero' },
  { name: 'À propos', id: 'about' },
  { name: 'Compétences', id: 'skills' },
  { name: 'Services', id: 'services' },
  { name: 'Portfolio', id: 'portfolio' },
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

  return (
    <nav className={`navbar${scrolled || isOpen ? ' scrolled' : ''}`}>
      <div className="container navbar-inner">
        <a href="#hero" onClick={handleClick('hero')} className="navbar-logo">
          <img src="/assets/logo-hero.png" alt="WillyDev" />
        </a>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <a key={link.id} href={`#${link.id}`} onClick={handleClick(link.id)} className="navbar-link">
              {link.name}
            </a>
          ))}
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
        {[...navLinks, { name: 'Contact', id: 'contact' }].map((link) => (
          <a key={link.id} href={`#${link.id}`} onClick={handleClick(link.id)} className="navbar-mobile-link display">
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
}
