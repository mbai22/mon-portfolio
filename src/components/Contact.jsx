import { useState } from 'react';
import { Send, Mail, MapPin, Clock, ChevronsRight } from 'lucide-react';
import Eyebrow from './Eyebrow';
import { socialLinks, CONTACT_EMAIL } from '../data/social';
import { useI18n } from '../i18n/context';

const contactInfo = [
  { icon: MapPin, label: 'contact.location', value: 'contact.locationValue' },
  { icon: Mail, label: 'contact.email', value: null },
  { icon: Clock, label: 'contact.availability', value: 'contact.availabilityValue' }
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
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');

  const validateField = (name, value) => {
    switch (name) {
      case 'name': return value.trim().length >= 2 ? '' : t('contact.errors.name');
      case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : t('contact.errors.email');
      case 'message': return value.trim().length >= 10 ? '' : t('contact.errors.message');
      case 'subject': return value ? '' : t('contact.errors.subject');
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
        throw new Error(data.error || t('contact.sendError'));
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
          <Eyebrow>{t('contact.eyebrow')}</Eyebrow>
          <h2 className="section-title">{t('contact.title')}</h2>
          <p className="section-text">
            {t('contact.text')}
          </p>

          <ul className="contact-info-list">
            {contactInfo.map((item) => (
              <li key={item.label} className="contact-info-item">
                <span className="contact-info-icon">
                  <item.icon size={18} />
                </span>
                <div>
                  <p className="contact-info-label">{t(item.label)}</p>
                  <p className="contact-info-value">{item.value ? t(item.value) : CONTACT_EMAIL}</p>
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
          <h3 className="contact-card-title display">{t('contact.formTitle')}</h3>

          {submitted ? (
            <div className="contact-success" role="status">
              <span className="contact-success-icon">
                <Send size={28} />
              </span>
              <h4 className="contact-success-title display">{t('contact.successTitle')}</h4>
              <p>{t('contact.successText')}</p>
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
                  <label className="contact-form-label" htmlFor="name">{t('contact.name')}</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldClass('name')}
                    placeholder={t('contact.namePh')}
                  />
                  {touched.name && errors.name && <p className="contact-error-text">{errors.name}</p>}
                </div>
                <div className="contact-form-group">
                  <label className="contact-form-label" htmlFor="email">{t('contact.emailLabel')}</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldClass('email')}
                    placeholder={t('contact.emailPh')}
                  />
                  {touched.email && errors.email && <p className="contact-error-text">{errors.email}</p>}
                </div>
              </div>

              <div className="contact-form-group">
                <label className="contact-form-label" htmlFor="subject">{t('contact.subject')}</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={fieldClass('subject')}
                >
                  {subjectOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{t(`contact.subjects.${opt.value}`)}</option>
                  ))}
                </select>
                {touched.subject && errors.subject && <p className="contact-error-text">{errors.subject}</p>}
              </div>

              <div className="contact-form-group">
                <label className="contact-form-label" htmlFor="message">{t('contact.message')}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={5}
                  className={fieldClass('message')}
                  placeholder={t('contact.messagePh')}
                />
                <div className="contact-form-footer">
                  {touched.message && errors.message ? <p className="contact-error-text">{errors.message}</p> : <span />}
                  <span className="contact-char-count">{t('contact.chars', { n: formData.message.length })}</span>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-pill contact-submit">
                {isSubmitting ? t('contact.sending') : t('contact.send')}
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
