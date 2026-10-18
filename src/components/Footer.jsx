import { ArrowUpRight, Mail } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { useSectionNav } from '../hooks/useSectionNav';
import { socialLinks, WHATSAPP_URL, CONTACT_EMAIL } from '../data/social';

const footerLinks = {
  navigation: [
    { label: "Accueil", id: "hero" },
    { label: "À propos", id: "about" },
    { label: "Compétences", id: "skills" },
    { label: "Services", id: "services" }
  ],
  more: [
    { label: "Portfolio", id: "portfolio" },
    { label: "Blog", id: "blog" },
    { label: "FAQ", id: "faq" },
    { label: "Contact", id: "contact" }
  ]
};

export default function Footer() {
  const goTo = useSectionNav();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-cta">
          <h2 className="footer-cta-title display">Prêt à lancer<br />votre projet ?</h2>

          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="footer-cta-card">
            <div className="footer-cta-card-text">
              <div className="footer-cta-icons" aria-hidden="true">
                <span><WhatsAppIcon size={14} /></span>
                <span><Mail size={14} /></span>
              </div>
              <span className="display">Réservez un appel<br />découverte de 15 min</span>
            </div>
            <span className="footer-cta-arrow" aria-hidden="true">
              <ArrowUpRight size={18} />
            </span>
          </a>
        </div>

        <div className="footer-card">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#hero" onClick={goTo('hero')} className="footer-logo">
                <img src="/assets/logo-hero.png" alt="WillyDev" />
              </a>
              <p className="footer-description">
                Développeur full stack, designer UI/UX et vidéaste basé au Tchad. Je crée des applications web modernes et performantes.
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
              <h3 className="footer-title display">Navigation</h3>
              <ul className="footer-links">
                {footerLinks.navigation.map((link) => (
                  <li key={link.id}>
                    <a href={`#${link.id}`} onClick={goTo(link.id)}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="footer-title display">Plus</h3>
              <ul className="footer-links">
                {footerLinks.more.map((link) => (
                  <li key={link.id}>
                    <a href={`#${link.id}`} onClick={goTo(link.id)}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="footer-title display">Contact</h3>
              <ul className="footer-links">
                <li><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
                <li>N'Djamena, Tchad</li>
                <li>Lun - Sam, 9h - 20h</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} WillyDev. Tous droits réservés.</p>
            <p>Fait avec passion au Tchad</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
