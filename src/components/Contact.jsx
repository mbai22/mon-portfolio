import { useState } from 'react';
import { Send, Mail, MapPin, Clock, ChevronsRight } from 'lucide-react';
import Eyebrow from './Eyebrow';
import { socialLinks, CONTACT_EMAIL } from '../data/social';

const contactInfo = [
  { icon: MapPin, label: "Localisation", value: "N'Djamena, Tchad" },
  { icon: Mail, label: "Email", value: CONTACT_EMAIL },
  { icon: Clock, label: "Disponibilité", value: "Lun - Sam, 9h - 20h" }
];

const subjectOptions = [
  { value: '', label: 'Sélectionnez un sujet' },
  { value: 'website', label: 'Création de site web' },
  { value: 'app', label: "Développement d'application" },
  { value: 'redesign', label: 'Refonte de site' },
  { value: 'consulting', label: 'Consulting technique' },
  { value: 'collab', label: 'Collaboration' },
  { value: 'quote', label: 'Demande de devis' },
  { value: 'other', label: 'Autre' },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');

  const validateField = (name, value) => {
    switch (name) {
      case 'name': return value.trim().length >= 2 ? '' : 'Le nom doit contenir au moins 2 caractères';
      case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Email invalide';
      case 'message': return value.trim().length >= 10 ? '' : 'Le message doit contenir au moins 10 caractères';
      case 'subject': return value ? '' : 'Veuillez sélectionner un sujet';
      default: return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setServerError('');
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({ name: true, email: true, subject: true, message: true });

    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/send-email.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      setTouched({});
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (name) => {
    if (!touched[name]) return 'contact-form-input';
    if (errors[name]) return 'contact-form-input error';
    return formData[name] ? 'contact-form-input success' : 'contact-form-input';
  };

  return (
    <section id="contact" className="section section-light contact-section">
      <div className="container contact-grid">
        <div className="contact-intro">
          <Eyebrow>Contact</Eyebrow>
          <h2 className="section-title">Travaillons ensemble</h2>
          <p className="section-text">
            Prêt à transformer votre idée en projet web ? Contactez-moi pour discuter de vos besoins.
          </p>

          <ul className="contact-info-list">
            {contactInfo.map((item) => (
              <li key={item.label} className="contact-info-item">
                <span className="contact-info-icon">
                  <item.icon size={18} />
                </span>
                <div>
                  <p className="contact-info-label">{item.label}</p>
                  <p className="contact-info-value">{item.value}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="social-row contact-social">
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

        <div className="contact-card">
          <h3 className="contact-card-title display">Envoyer un message</h3>

          {submitted ? (
            <div className="contact-success" role="status">
              <span className="contact-success-icon">
                <Send size={28} />
              </span>
              <h4 className="contact-success-title display">Message envoyé !</h4>
              <p>Je vous répondrai dans les plus brefs délais.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              {serverError && (
                <div className="contact-server-error" role="alert">
                  <p>{serverError}</p>
                </div>
              )}

              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label className="contact-form-label" htmlFor="name">Nom complet</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldClass('name')}
                    placeholder="Jean Dupont"
                  />
                  {touched.name && errors.name && <p className="contact-error-text">{errors.name}</p>}
                </div>
                <div className="contact-form-group">
                  <label className="contact-form-label" htmlFor="email">Adresse email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldClass('email')}
                    placeholder="jean@exemple.com"
                  />
                  {touched.email && errors.email && <p className="contact-error-text">{errors.email}</p>}
                </div>
              </div>

              <div className="contact-form-group">
                <label className="contact-form-label" htmlFor="subject">Sujet</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={fieldClass('subject')}
                >
                  {subjectOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {touched.subject && errors.subject && <p className="contact-error-text">{errors.subject}</p>}
              </div>

              <div className="contact-form-group">
                <label className="contact-form-label" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={5}
                  className={fieldClass('message')}
                  placeholder="Décrivez votre projet en détail..."
                />
                <div className="contact-form-footer">
                  {touched.message && errors.message ? <p className="contact-error-text">{errors.message}</p> : <span />}
                  <span className="contact-char-count">{formData.message.length} caractères</span>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-pill contact-submit">
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                <span className="circle-icon">
                  {isSubmitting ? <span className="contact-spinner animate-spin" /> : <ChevronsRight size={16} />}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
