import { createContext, useContext, useState, useCallback } from 'react';

const translations = {
  fr: {
    nav: {
      home: 'Accueil',
      about: 'À Propos',
      portfolio: 'Portfolio',
      services: 'Services',
      contact: 'Contact',
    },
    hero: {
      badge: 'Disponible pour missions',
      subtitle: 'Développeur Full Stack',
      description: 'Création d\'applications web, de designs UI/UX et de contenus vidéo professionnels.',
      stats: {
        projects: 'Projets réalisés',
        clients: 'Clients',
        experience: 'Expérience',
      },
    },
    about: {
      title: 'À propos de moi',
      description: 'Je suis Willy Dev, développeur web, designer UI/UX et vidéaste basé au Tchad. Passionné par la création numérique sous toutes ses formes.',
      skills: ['Laravel', 'React', 'Angular', 'Figma', 'Premiere Pro', 'After Effects'],
      achievements: {
        projects: 'Projets Livrés',
        clients: 'Clients Satisfaits',
        location: 'Basé à N\'djamena',
        experience: 'D\'expérience',
      },
    },
    services: {
      title: 'Ce que je propose',
      description: 'Des services professionnels en développement web, design graphique et production vidéo.',
      cta: 'Réserver',
    },
    contact: {
      title: 'Travaillons ensemble',
      description: 'Prêt à créer quelque chose d\'incroyable ? Contactez-moi pour discuter de votre projet.',
      form: {
        title: 'Envoyer un message',
        name: 'Nom',
        email: 'Email',
        subject: 'Sujet',
        message: 'Message',
        subjects: {
          project: 'Nouveau projet',
          collaboration: 'Collaboration',
          quote: 'Devis',
          other: 'Autre',
        },
        send: 'Envoyer le message',
        sending: 'Envoi en cours...',
        success: 'Message envoyé !',
        successText: 'Je vous répondrai dans les plus brefs délais.',
      },
    },
    footer: {
      description: 'Développeur Full Stack passionné, créateur d\'applications web modernes et performantes.',
      newsletter: {
        title: 'Restez informé',
        text: 'Recevez mes actualités directement dans votre boîte mail.',
        success: 'Merci ! Vous êtes inscrit.',
      },
      copyright: 'Fait avec',
      in: 'au Tchad',
      legal: {
        terms: 'Conditions d\'utilisation',
        privacy: 'Politique de confidentialité',
        legal: 'Mentions légales',
      },
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      portfolio: 'Portfolio',
      services: 'Services',
      contact: 'Contact',
    },
    hero: {
      badge: 'Available for missions',
      subtitle: 'Full Stack Developer',
      description: 'Building web applications, UI/UX designs and professional video content.',
      stats: {
        projects: 'Projects Done',
        clients: 'Clients',
        experience: 'Experience',
      },
    },
    about: {
      title: 'About me',
      description: 'I am Willy Dev, a web developer, UI/UX designer and video maker based in Chad. Passionate about digital creation in all its forms.',
      skills: ['Laravel', 'React', 'Angular', 'Figma', 'Premiere Pro', 'After Effects'],
      achievements: {
        projects: 'Projects Delivered',
        clients: 'Happy Clients',
        location: 'Based in N\'djamena',
        experience: 'Experience',
      },
    },
    services: {
      title: 'What I offer',
      description: 'Professional services in web development, graphic design and video production.',
      cta: 'Book Now',
    },
    contact: {
      title: 'Let\'s work together',
      description: 'Ready to create something incredible? Contact me to discuss your project.',
      form: {
        title: 'Send a message',
        name: 'Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
        subjects: {
          project: 'New project',
          collaboration: 'Collaboration',
          quote: 'Quote',
          other: 'Other',
        },
        send: 'Send message',
        sending: 'Sending...',
        success: 'Message sent!',
        successText: 'I will reply as soon as possible.',
      },
    },
    footer: {
      description: 'Passionate Full Stack Developer, creator of modern and performant web applications.',
      newsletter: {
        title: 'Stay informed',
        text: 'Receive my updates directly in your inbox.',
        success: 'Thank you! You are subscribed.',
      },
      copyright: 'Made with',
      in: 'in Chad',
      legal: {
        terms: 'Terms of Use',
        privacy: 'Privacy Policy',
        legal: 'Legal Notice',
      },
    },
  },
};

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState('fr');

  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[locale];
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    return value || key;
  }, [locale]);

  const toggleLocale = useCallback(() => {
    setLocale(prev => prev === 'fr' ? 'en' : 'fr');
  }, []);

  const setLanguage = useCallback((lang) => {
    if (translations[lang]) {
      setLocale(lang);
    }
  }, []);

  const value = {
    locale,
    t,
    toggleLocale,
    setLanguage,
    isFrench: locale === 'fr',
    isEnglish: locale === 'en',
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
