import { useState } from 'react';
import { Send, Mail, MapPin, Clock, Linkedin, Github } from 'lucide-react';

const socialLinks = [
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/mba%C3%AFhornomwillifred/" },
  { icon: Github, label: "GitHub", href: "https://github.com/mbai22" },
];

const contactInfo = [
  { icon: MapPin, label: "Localisation", value: "N'djamena, Tchad" },
  { icon: Mail, label: "Email", value: "contact@willydev.online" },
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

  return (
    <section id="contact" className="bg-primary contact-section">
      <div className="contact-bg">
        <img src="/assets/contact.png" alt="" className="contact-bg-image" />
      </div>
      <div className="section-container">
        <div className="section-header">
          <span className="section-label">Contact</span>
          <h2 className="section-title">Travaillons <span className="text-orange">ensemble</span></h2>
          <p className="section-description">
            Prêt à transformer votre idée en projet web ? Contactez-moi pour discuter de vos besoins.
          </p>
        </div>

        <div className="contact-grid">
          <div className="animate-slideInLeft">
            <div>
              <h3 className="contact-info-title">Informations</h3>
              <div className="contact-info-list">
                {contactInfo.map((item) => (
                  <div key={item.label} className="contact-info-item">
                    <div className="contact-info-icon">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="contact-info-label">{item.label}</p>
                      <p className="contact-info-value">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="contact-social-title">Suivez-moi</p>
              <div className="contact-social-links">
                {socialLinks.map((social) => (
                  <a key={social.label} href={social.href} className="contact-social-link" aria-label={social.label}>
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper animate-slideInRight">
            <h3 className="contact-form-title">Envoyer un message</h3>

            {submitted ? (
              <div className="contact-success">
                <div className="contact-success-icon">
                  <Send size={32} />
                </div>
                <h4 className="contact-success-title">Message envoyé !</h4>
                <p className="contact-success-text">Je vous répondrai dans les plus brefs délais.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                {serverError && (
                  <div className="contact-server-error">
                    <p>{serverError}</p>
                  </div>
                )}

                <div className="contact-form-group">
                  <label className="contact-form-label" htmlFor="name">Nom complet</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`contact-form-input ${touched[name] && errors[name] ? 'error' : ''} ${touched[name] && !errors[name] && formData.name ? 'success' : ''}`}
                    placeholder="Jean Dupont"
                  />
                  {touched[name] && errors[name] && <p className="contact-error-text">{errors[name]}</p>}
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
                    className={`contact-form-input ${touched.email && errors.email ? 'error' : ''} ${touched.email && !errors.email && formData.email ? 'success' : ''}`}
                    placeholder="jean@exemple.com"
                  />
                  {touched.email && errors.email && <p className="contact-error-text">{errors.email}</p>}
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label" htmlFor="subject">Sujet</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`contact-form-select ${touched.subject && errors.subject ? 'error' : ''} ${touched.subject && !errors.subject && formData.subject ? 'success' : ''}`}
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
                    className={`contact-form-textarea ${touched.message && errors.message ? 'error' : ''} ${touched.message && !errors.message && formData.message ? 'success' : ''}`}
                    placeholder="Décrivez votre projet en détail..."
                  />
                  <div className="contact-form-footer">
                    {touched.message && errors.message && <p className="contact-error-text">{errors.message}</p>}
                    <span className="contact-char-count">{formData.message.length} caractères</span>
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="contact-form-submit">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%' }} />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
