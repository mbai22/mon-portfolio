// Textes de l'interface en français (langue d'origine du site)
import pages from './pages/fr';

export default {
  ...pages,
  lang: { label: 'Langue', fr: 'Français', en: 'English', ar: 'العربية' },
  nav: {
    home: 'Accueil', about: 'À propos', skills: 'Compétences', services: 'Services', portfolio: 'Portfolio',
    blog: 'Blog', faq: 'FAQ', contact: 'Contact', cta: 'Me contacter', open: 'Ouvrir le menu', close: 'Fermer le menu',
  },
  hero: {
    title1: 'Je suis Willy,', title2: 'Développeur Web & Mobile',
    text: "Développement d'applications web et mobiles, design graphique et montage vidéo à N'Djamena : je donne vie à vos idées.",
    scroll: 'Défiler vers la section À propos',
    alt: "Willy, développeur web et mobile, graphiste et monteur vidéo à N'Djamena",
    aboutTitle: 'À propos', aboutText: "Développeur full stack, designer UI/UX et vidéaste basé à N'Djamena, au Tchad.", more: 'En savoir plus',
    workTitle: 'Mon travail', workText: 'Sites internet, applications web et mobiles, design graphique et montage vidéo.', seePortfolio: 'Voir le portfolio',
    follow: 'Suivez-moi',
  },
  about: {
    eyebrow: 'À propos', title: 'Des solutions digitales qui font la différence',
    before: 'Je suis ', after: ", développeur web et mobile, graphiste et monteur vidéo basé à N'Djamena, au Tchad. Je crée des sites internet et des applications web et mobiles performants, des identités visuelles soignées et des vidéos engageantes pour les marques et les entrepreneurs.",
    cta: 'Discutons de votre projet',
    mission: "Ma mission : transformer vos idées en solutions concrètes, que ce soit une plateforme web, une identité visuelle ou un contenu vidéo professionnel. Je mise sur la qualité, la créativité et l'impact.",
    partners: "Ils m'ont fait confiance",
    years: "Années d'expérience", projects: 'Projets web livrés', clients: 'Clients satisfaits',
  },
  skills: { eyebrow: 'Compétences', title: 'Une boîte à outils complète', prev: 'Précédent', next: 'Suivant', video: 'Vidéo' },
  services: {
    eyebrow: 'Services', title: 'Des services sur mesure pour concrétiser vos idées', tabs: 'Catégories de services',
    from: 'Dès', quote: 'Sur devis', start: 'Démarrer',
    ctaTitle: 'Combien coûte votre projet ?', ctaText: 'Obtenez une estimation en 1 minute, réservez un appel gratuit ou testez votre site actuel.',
    ctaEstimate: 'Estimer mon projet', ctaBook: 'Réserver un appel', ctaAudit: 'Audit gratuit',
  },
  portfolio: { eyebrow: 'Réalisations', title: 'Des projets qui répondent à de vrais besoins', all: 'Tous', seeAll: 'Voir tout le portfolio' },
  testimonials: { eyebrow: 'Témoignages', title: 'Ce que disent mes clients', stars: '{n} étoiles sur 5', verified: 'Avis vérifié · client Willy Dev' },
  blog: { eyebrow: 'Blog & conseils', title: "Conseils et retours d'expérience pour vos projets web" },
  faq: {
    eyebrow: 'FAQ', title: 'Questions fréquentes', helpTitle: 'Encore des questions ?',
    helpText: 'Écrivez-moi à tout moment, je vous réponds rapidement.', helpBtn: 'Contact',
  },
  contact: {
    eyebrow: 'Contact', title: 'Travaillons ensemble', text: 'Prêt à transformer votre idée en projet web ? Contactez-moi pour discuter de vos besoins.',
    location: 'Localisation', locationValue: "N'Djamena, Tchad", email: 'Email', availability: 'Disponibilité', availabilityValue: 'Lun - Sam, 9h - 20h',
    formTitle: 'Envoyer un message', successTitle: 'Message envoyé !', successText: 'Je vous répondrai dans les plus brefs délais.',
    name: 'Nom complet', namePh: 'Jean Dupont', emailLabel: 'Adresse email', emailPh: 'jean@exemple.com',
    subject: 'Sujet', message: 'Message', messagePh: 'Décrivez votre projet en détail...', chars: '{n} caractères',
    sending: 'Envoi en cours...', send: 'Envoyer le message', sendError: "Erreur lors de l'envoi",
    subjects: {
      '': 'Sélectionnez un sujet', website: 'Création de site web', app: "Développement d'application", redesign: 'Refonte de site',
      consulting: 'Consulting technique', collab: 'Collaboration', quote: 'Demande de devis', other: 'Autre',
    },
    errors: {
      name: 'Le nom doit contenir au moins 2 caractères', email: 'Email invalide',
      message: 'Le message doit contenir au moins 10 caractères', subject: 'Veuillez sélectionner un sujet',
    },
  },
  footer: {
    ctaTitle1: 'Prêt à lancer', ctaTitle2: 'votre projet ?', ctaCard1: 'Réservez un appel', ctaCard2: 'découverte de 15 min',
    navigation: 'Navigation', more: 'Plus', contact: 'Contact',
    description: "Développement d'applications web et mobiles, design graphique et montage vidéo à N'Djamena, au Tchad.",
    estimate: 'Estimer mon projet', book: 'Prendre rendez-vous', audit: 'Audit gratuit',
    hours: 'Lun - Sam, 9h - 20h', rights: 'Tous droits réservés.', made: 'Fait avec passion au Tchad',
  },
  chat: {
    greeting: 'Bonjour ! Je suis l’assistant de Willy. Posez-moi vos questions sur les sites, applications, logos ou vidéos : tarifs, délais, façon de travailler…',
    suggestions: ['Combien coûte un site vitrine ?', 'Faites-vous des applications mobiles ?', 'Quels sont les délais ?'],
    title: 'Assistant Willy Dev', subtitle: 'Réponses automatiques par IA · Willy reprend la main sur WhatsApp',
    placeholder: 'Votre question…', send: 'Envoyer', open: 'Poser une question à l’assistant', close: 'Fermer l’assistant',
    typing: 'L’assistant écrit…', error: 'L’assistant ne répond pas, réessayez.',
  },
  whatsapp: 'Discuter sur WhatsApp',
};
