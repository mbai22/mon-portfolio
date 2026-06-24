import { useState } from 'react';
import { Send, MessageCircle, Mail, MapPin, Phone, Clock, Linkedin, Github, AlertCircle, CheckCircle } from 'lucide-react';

const socialLinks = [
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/mba%C3%AFhornomwillifred/" },
  { icon: Github, label: "GitHub", href: "https://github.com/mbai22" },
];

const contactInfo = [
  { icon: MapPin, label: "Localisation", value: "N'djamena, Tchad" },
  { icon: Phone, label: "WhatsApp Tchad", value: "+235 63 93 57 84" },
  { icon: Phone, label: "WhatsApp Cameroun", value: "+237 69 55 77 792" },
  { icon: Mail, label: "Email", value: "contact@willydev.com" },
  { icon: Clock, label: "Disponibilité", value: "Lun - Sam, 9h - 20h" }
];

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validateName = (name) => {
  return name.trim().length >= 2;
};

const validateMessage = (message) => {
  return message.trim().length >= 10;
};

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return validateName(value) ? '' : 'Le nom doit contenir au moins 2 caractères';
      case 'email':
        return validateEmail(value) ? '' : 'Email invalide';
      case 'message':
        return validateMessage(value) ? '' : 'Le message doit contenir au moins 10 caractères';
      case 'subject':
        return value ? '' : 'Veuillez sélectionner un sujet';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
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
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    setTouched({ name: true, email: true, subject: true, message: true });
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrors({});
    setTouched({});
    setTimeout(() => setSubmitted(false), 5000);
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] ? errors[fieldName] || null : null;
  };

  const isFieldValid = (fieldName) => {
    return touched[fieldName] && !errors[fieldName] && formData[fieldName];
  };

  return (
    <section id="contact" className="bg-primary contact-section">
      <div className="contact-bg">
        <img src="/assets/contact.png" alt="Background" className="contact-bg-image" />
      </div>
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-label">Contact</span>
          <h2 className="section-title">Travaillons <span className="text-orange">ensemble</span></h2>
          <p className="section-description">
            Prêt à transformer votre idée en projet web ? Contactez-moi pour discuter de vos besoins.
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Info */}
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

            {/* Quick WhatsApp */}
            <div className="contact-whatsapp-group">
              <a
                href="https://wa.me/23563935784"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-whatsapp"
              >
                <div className="contact-whatsapp-icon">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <p className="contact-whatsapp-title">WhatsApp Tchad</p>
                  <p className="contact-whatsapp-text">+235 63 93 57 84</p>
                </div>
              </a>
              <a
                href="https://wa.me/237695577792"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-whatsapp"
              >
                <div className="contact-whatsapp-icon">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <p className="contact-whatsapp-title">WhatsApp Cameroun</p>
                  <p className="contact-whatsapp-text">+237 69 55 77 792</p>
                </div>
              </a>
            </div>

            {/* Social Links */}
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

          {/* Contact Form */}
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
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label className="contact-form-label">Nom</label>
                    <div className="contact-input-wrapper">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`contact-form-input ${getFieldError('name') ? 'error' : ''} ${isFieldValid('name') ? 'success' : ''}`}
                        placeholder="Votre nom"
                      />
                      {getFieldError('name') && <AlertCircle size={16} className="contact-input-icon error" />}
                      {isFieldValid('name') && <CheckCircle size={16} className="contact-input-icon success" />}
                    </div>
                    {getFieldError('name') && <p className="contact-error-text">{getFieldError('name')}</p>}
                  </div>
                  <div className="contact-form-group">
                    <label className="contact-form-label">Email</label>
                    <div className="contact-input-wrapper">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`contact-form-input ${getFieldError('email') ? 'error' : ''} ${isFieldValid('email') ? 'success' : ''}`}
                        placeholder="votre@email.com"
                      />
                      {getFieldError('email') && <AlertCircle size={16} className="contact-input-icon error" />}
                      {isFieldValid('email') && <CheckCircle size={16} className="contact-input-icon success" />}
                    </div>
                    {getFieldError('email') && <p className="contact-error-text">{getFieldError('email')}</p>}
                  </div>
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label">Sujet</label>
                  <div className="contact-input-wrapper">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`contact-form-select ${getFieldError('subject') ? 'error' : ''} ${isFieldValid('subject') ? 'success' : ''}`}
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="website">Création de site web</option>
                      <option value="app">Développement d'application</option>
                      <option value="redesign">Refonte de site</option>
                      <option value="consulting">Consulting technique</option>
                      <option value="collab">Collaboration</option>
                      <option value="quote">Demande de devis</option>
                      <option value="other">Autre</option>
                    </select>
                    {getFieldError('subject') && <AlertCircle size={16} className="contact-input-icon error" />}
                    {isFieldValid('subject') && <CheckCircle size={16} className="contact-input-icon success" />}
                  </div>
                  {getFieldError('subject') && <p className="contact-error-text">{getFieldError('subject')}</p>}
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label">Message</label>
                  <div className="contact-input-wrapper">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      rows={4}
                      className={`contact-form-textarea ${getFieldError('message') ? 'error' : ''} ${isFieldValid('message') ? 'success' : ''}`}
                      placeholder="Décrivez votre projet..."
                    />
                    {getFieldError('message') && <AlertCircle size={16} className="contact-input-icon error" />}
                    {isFieldValid('message') && <CheckCircle size={16} className="contact-input-icon success" />}
                  </div>
                  {getFieldError('message') && <p className="contact-error-text">{getFieldError('message')}</p>}
                </div>

                <button type="submit" disabled={isSubmitting} className="contact-form-submit">
                  {isSubmitting ? (
                    <>
                      <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
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
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
