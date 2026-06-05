import { useState } from 'react';
import { Code, ArrowUp, Github, Linkedin, Mail, CheckCircle, Loader2, Send, ExternalLink } from 'lucide-react';

// Configuration Mailchimp - À remplacer par tes vraies valeurs
const MAILCHIMP_URL = import.meta.env.VITE_MAILCHIMP_URL || 'https://youraccount.us1.list-manage.com/subscribe/post';
const MAILCHIMP_U = import.meta.env.VITE_MAILCHIMP_U || 'your_user_id';
const MAILCHIMP_ID = import.meta.env.VITE_MAILCHIMP_ID || 'your_list_id';

const footerLinks = {
  navigation: [
    { label: "Accueil", href: "#hero" },
    { label: "À Propos", href: "#about" },
    { label: "Compétences", href: "#skills" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" }
  ],
  services: [
    { label: "Développement Web", href: "#services" },
    { label: "Applications Mobiles", href: "#services" },
    { label: "API REST", href: "#services" },
    { label: "Maintenance", href: "#services" }
  ],
  legal: [
    { label: "Conditions d'utilisation", href: "#" },
    { label: "Politique de confidentialité", href: "#" },
    { label: "Mentions légales", href: "#" }
  ]
};

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "mailto:contact@willydev.com", label: "Email" }
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Méthode 1: Envoi via fetch à ton backend qui appelle l'API Mailchimp
      // Méthode 2: Soumission directe au formulaire Mailchimp
      const formData = new FormData();
      formData.append('EMAIL', email);
      formData.append('u', MAILCHIMP_U);
      formData.append('id', MAILCHIMP_ID);

      await fetch(`${MAILCHIMP_URL}?u=${MAILCHIMP_U}&id=${MAILCHIMP_ID}`, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });

      setIsSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Newsletter error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="footer">
      {/* Top Section */}
      <div className="section-container footer-top">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <a href="#hero" className="footer-brand">
              <img src="/assets/logo-hero.png" alt="WillyDev" className="footer-logo-img" />
            </a>
            <p className="footer-description">
              Développeur Full Stack basé au Tchad. Spécialisé en Angular, Laravel et React. Je crée des applications web modernes et performantes.
            </p>
            <div className="footer-social">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} className="footer-social-link" aria-label={social.label}>
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-links">
              {footerLinks.navigation.map((link) => (
                <li key={link.label} className="footer-link">
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="footer-title">Services</h4>
            <ul className="footer-links">
              {footerLinks.services.map((link) => (
                <li key={link.label} className="footer-link">
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="footer-title">Restez informé</h4>
            <p className="footer-newsletter-text">
              Recevez les nouveaux beats et actualités directement dans votre boîte mail.
            </p>
            {isSubscribed ? (
              <div className="footer-success">
                <CheckCircle size={20} />
                <span>Merci ! Vous êtes inscrit.</span>
              </div>
            ) : (
              <form className="footer-form" onSubmit={handleNewsletterSubmit}>
                <input 
                  type="email" 
                  placeholder="votre@email.com" 
                  className="footer-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                <button 
                  type="submit" 
                  className="footer-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="section-container">
          <div className="footer-bottom-content">
            {/* Copyright */}
            <p className="footer-copyright">
              © 2024 WillyDev. Tous droits réservés.
            </p>

            {/* Legal Links */}
            <div className="footer-legal">
              {footerLinks.legal.map((link) => (
                <a key={link.label} href={link.href} className="footer-legal-link">{link.label}</a>
              ))}
            </div>

            {/* Back to Top */}
            <button onClick={scrollToTop} className="footer-scroll-top" aria-label="Retour en haut">
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
