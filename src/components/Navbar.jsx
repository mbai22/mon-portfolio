import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSectionNav } from '../hooks/useSectionNav';
import { useI18n } from '../i18n/context';

// `id` scrolls to a home-page section, `to` opens a separate page
const navLinks = [
  { key: 'nav.home', id: 'hero' },
  { key: 'nav.about', id: 'about' },
  { key: 'nav.skills', id: 'skills' },
  { key: 'nav.services', id: 'services' },
  { key: 'nav.portfolio', to: '/portfolio' },
  { key: 'nav.blog', id: 'blog' },
  { key: 'nav.faq', id: 'faq' },
];

const LANGS = [
  { code: 'fr', short: 'FR' },
  { code: 'en', short: 'EN' },
  { code: 'ar', short: 'ع' },
];

function LanguageSwitch({ className = '' }) {
  const { locale, setLanguage, t } = useI18n();
  return (
    <div className={`lang-switch ${className}`} role="group" aria-label={t('lang.label')}>
      {LANGS.map((l) => (
        <button key={l.code} type="button" lang={l.code} aria-pressed={locale === l.code} title={t(`lang.${l.code}`)}
          className={locale === l.code ? 'active' : ''} onClick={() => setLanguage(l.code)}>
          {l.short}
        </button>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const goTo = useSectionNav();
  const { t } = useI18n();

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
    <NavLink key={link.key} to={link.to} onClick={() => setIsOpen(false)} className={className}>
      {t(link.key)}
    </NavLink>
  ) : (
    <a key={link.key} href={`#${link.id}`} onClick={handleClick(link.id)} className={className}>
      {t(link.key)}
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

        <LanguageSwitch className="navbar-lang" />

        <a href="#contact" onClick={handleClick('contact')} className="navbar-cta">
          {t('nav.cta')}
        </a>

        <button
          className="navbar-toggle"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? t('nav.close') : t('nav.open')}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className={`navbar-mobile${isOpen ? ' open' : ''}`}>
        {[...navLinks, { key: 'nav.contact', id: 'contact' }].map((link) => renderLink(link, 'navbar-mobile-link display'))}
        <LanguageSwitch className="navbar-mobile-lang" />
      </div>
    </nav>
  );
}
