// Estimateur de devis (page /devis), modifiable depuis /admin.
// Montants en FCFA. Ce sont des prix de départ indicatifs : à ajuster dans l'admin.
// - base : prix de départ du type de projet
// - includedPages / perPage : pages comprises, puis prix de chaque page en plus (0 = pas de choix de pages)
// - options[].types : types de projet auxquels l'option s'applique (vide = tous)
// - delays[].factor : multiplicateur du total (1 = délai normal)
// - spread : l'estimation affiche une fourchette de « total » à « total × (1 + spread) »
export const estimator = {
  intro: "Répondez à 3 questions pour obtenir une estimation indicative, puis envoyez-la-moi sur WhatsApp pour recevoir un devis précis et gratuit.",
  spread: 0.2,
  projectTypes: [
    { id: 'vitrine', label: 'Site vitrine', description: "Présenter votre activité, vos services et vos coordonnées.", base: 150000, includedPages: 5, perPage: 15000 },
    { id: 'ecommerce', label: 'Boutique en ligne', description: 'Catalogue, panier, commandes et paiement.', base: 350000, includedPages: 8, perPage: 15000 },
    { id: 'webapp', label: 'Application web', description: 'Plateforme sur mesure : espace membre, tableau de bord, gestion.', base: 300000, includedPages: 0, perPage: 0 },
    { id: 'mobile', label: 'Application mobile', description: 'Application Android (et iOS) avec son interface d’administration.', base: 500000, includedPages: 0, perPage: 0 },
    { id: 'redesign', label: 'Refonte de site', description: 'Moderniser un site existant : design, vitesse, référencement.', base: 100000, includedPages: 5, perPage: 10000 },
    { id: 'branding', label: 'Logo & identité visuelle', description: 'Logo, couleurs, typographies et supports de base.', base: 50000, includedPages: 0, perPage: 0 },
    { id: 'video', label: 'Montage vidéo', description: 'Spot publicitaire, présentation d’entreprise, contenus réseaux sociaux.', base: 40000, includedPages: 0, perPage: 0 },
  ],
  options: [
    { id: 'mobilemoney', label: 'Paiement Mobile Money (Airtel Money, Moov Money)', price: 75000, types: ['ecommerce', 'webapp', 'mobile'] },
    { id: 'multilingue', label: 'Site en plusieurs langues (français, arabe, anglais)', price: 50000, types: ['vitrine', 'ecommerce', 'webapp', 'redesign'] },
    { id: 'redaction', label: 'Rédaction des textes', price: 30000, types: ['vitrine', 'ecommerce', 'redesign'] },
    { id: 'logo', label: 'Création du logo', price: 50000, types: ['vitrine', 'ecommerce', 'webapp', 'mobile', 'redesign'] },
    { id: 'seo', label: 'Référencement Google renforcé', price: 40000, types: ['vitrine', 'ecommerce', 'redesign'] },
    { id: 'hebergement', label: 'Nom de domaine + hébergement (1 an)', price: 45000, types: ['vitrine', 'ecommerce', 'webapp', 'redesign'] },
    { id: 'formation', label: 'Formation pour gérer le contenu', price: 20000, types: ['vitrine', 'ecommerce', 'webapp', 'mobile', 'redesign'] },
    { id: 'charte', label: 'Charte graphique complète', price: 60000, types: ['branding'] },
    { id: 'motion', label: 'Animations / motion design', price: 30000, types: ['video', 'branding'] },
    { id: 'sous-titres', label: 'Sous-titres et formats réseaux sociaux', price: 15000, types: ['video'] },
  ],
  delays: [
    { id: 'normal', label: 'Délai normal', factor: 1 },
    { id: 'rapide', label: 'Urgent (délai réduit de moitié)', factor: 1.3 },
  ],
};
