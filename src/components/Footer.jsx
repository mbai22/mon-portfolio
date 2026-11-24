import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { useSectionNav } from '../hooks/useSectionNav';
import { socialLinks, CONTACT_EMAIL } from '../data/social';
import { useI18n } from '../i18n/context';

const footerLinks = {
  navigation: [
    { label: 'nav.home', id: 'hero' },
    { label: 'nav.about', id: 'about' },
    { label: 'nav.skills', id: 'skills' },
    { label: 'nav.services', id: 'services' }
  ],
  more: [
    { label: 'nav.portfolio', to: '/portfolio' },
    { label: 'footer.estimate', to: '/devis' },
    { label: 'footer.book', to: '/rendez-vous' },
    { label: 'footer.audit', to: '/audit' },
    { label: 'nav.blog', id: 'blog' },
    { label: 'nav.faq', id: 'faq' }
  ]
};

export default function Footer() {
  const goTo = useSectionNav();
  const { t } = useI18n();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-cta">
          <h2 className="footer-cta-title display">{t('footer.ctaTitle1')}<br />{t('footer.ctaTitle2')}</h2>

          <Link to="/rendez-vous" className="footer-cta-card">
            <div className="footer-cta-card-text">
              <div className="footer-cta-icons" aria-hidden="true">
                <span><WhatsAppIcon size={14} /></span>
                <span><Mail size={14} /></span>
              </div>
              <span className="display">{t('footer.ctaCard1')}<br />{t('footer.ctaCard2')}</span>
            </div>
            <span className="footer-cta-arrow" aria-hidden="true">
              <ArrowUpRight size={18} />
            </span>
          </Link>
        </div>

        <div className="footer-card">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#hero" onClick={goTo('hero')} className="footer-logo">
                <img src="/assets/logo-hero.png" alt="WillyDev" />
              </a>
              <p className="footer-description">
                {t('footer.description')}
              </p>
              <div className="social-row footer-social">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="social-link"
                    aria-label={social.label}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="footer-title display">{t('footer.navigation')}</h3>
              <ul className="footer-links">
                {footerLinks.navigation.map((link) => (
                  <li key={link.id}>
                    <a href={`#${link.id}`} onClick={goTo(link.id)}>{t(link.label)}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="footer-title display">{t('footer.more')}</h3>
              <ul className="footer-links">
                {footerLinks.more.map((link) => (
                  <li key={link.label}>
                    {link.to
                      ? <Link to={link.to}>{t(link.label)}</Link>
                      : <a href={`#${link.id}`} onClick={goTo(link.id)}>{t(link.label)}</a>}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="footer-title display">{t('footer.contact')}</h3>
              <ul className="footer-links">
                <li><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
                <li>{t('contact.locationValue')}</li>
                <li>{t('footer.hours')}</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} WillyDev. {t('footer.rights')}</p>
            <p>{t('footer.made')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
