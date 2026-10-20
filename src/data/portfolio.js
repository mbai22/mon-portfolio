// Réalisations affichées sur la page /portfolio (en plus des projets code de ./projects.js).
// Tant qu'une liste est vide, sa section affiche un message « bientôt disponible ».

// Design graphique : mettre les images dans public/assets/portfolio/design/
// {
//   id: 'logo-cunicole-sahel',
//   title: 'Logo Cunicole Sahel',
//   client: 'Cunicole Sahel',
//   category: 'Logo',                 // une des designCategories ci-dessous
//   image: '/assets/portfolio/design/logo-cunicole-sahel.jpg',
// },
// Seules les catégories qui ont au moins une réalisation apparaissent dans les filtres.
export const designCategories = ['Réseaux sociaux', 'Affiche & flyer', 'Carte de visite', 'Logo', 'Identité visuelle'];

const VIA_NOU = 'Via Nou Rajaonha, community manager';
const CUNICOLE = 'Ferme Cunicole Sahel';
const DESIGN_DIR = '/assets/portfolio/design';

// Ferme Cunicole Sahel : identité visuelle et campagne réseaux sociaux
const cunicole = (slug, title, category) => ({
  id: `cunicole-sahel-${slug}`,
  title,
  client: CUNICOLE,
  category,
  image: `${DESIGN_DIR}/cunicole-sahel-${slug}.webp`,
});

const cunicoleWorks = [
  cunicole('logo', 'Logo Cunicole Sahel', 'Logo'),
  cunicole('logo-lapin', 'Logo Cunicole Sahel, version avec lapin', 'Logo'),
  cunicole('photo-de-profil', 'Photo de profil aux couleurs de la ferme', 'Identité visuelle'),
  cunicole('couverture-facebook', 'Couverture Facebook « Bienvenue à la Ferme Cunicole Sahel »', 'Réseaux sociaux'),
  cunicole('post-bienvenue', 'Publication « Bienvenue à la Ferme Cunicole Sahel »', 'Réseaux sociaux'),
  cunicole('post-bienvenue-eleveuse', 'Publication de bienvenue avec l’éleveuse', 'Réseaux sociaux'),
  cunicole('post-promo', 'Affiche promotion « Réduction spéciale pour nos abonnés »', 'Affiche & flyer'),
  cunicole('post-lapins-disponibles', 'Publication « Lapins disponibles »', 'Réseaux sociaux'),
  cunicole('post-100-naturel', 'Publication « C’est 100 % naturel »', 'Réseaux sociaux'),
  cunicole('post-gout-du-vrai', 'Publication « Le goût du vrai »', 'Réseaux sociaux'),
  cunicole('post-aujourdhui-a-la-ferme', 'Publication « Aujourd’hui à la ferme »', 'Réseaux sociaux'),
  cunicole('post-bon-elevage', 'Publication « Un bon lapin vient d’un bon élevage »', 'Réseaux sociaux'),
  cunicole('post-ferme-locale', 'Publication « Tu veux soutenir une ferme locale ? »', 'Réseaux sociaux'),
  cunicole('post-vision-travail-passion', 'Publication « Une vision, du travail, de la passion »', 'Réseaux sociaux'),
  cunicole('post-grandis-avec-nous', 'Publication « Abonne-toi et grandis avec nous »', 'Réseaux sociaux'),
  cunicole('post-lapins-commande', 'Publication photo avec bandeau de commande', 'Réseaux sociaux'),
];

// GameZone (salle de jeux vidéo, quartier Habbena) : identité visuelle et affiches de tournois
const gamezone = (slug, title, category) => ({
  id: `gamezone-${slug}`,
  title,
  client: 'GameZone, salle de jeux vidéo',
  category,
  image: `${DESIGN_DIR}/gamezone-${slug}.webp`,
});

const gamezoneWorks = [
  gamezone('planche-identite-visuelle', 'Identité visuelle GameZone : enseigne, sweat, mugs et couleurs', 'Identité visuelle'),
  gamezone('logo', 'Logo GameZone avec slogan', 'Logo'),
  gamezone('logo-sans-slogan', 'Logo GameZone', 'Logo'),
  gamezone('mockup-enseigne', 'Enseigne lumineuse GameZone', 'Identité visuelle'),
  gamezone('mockup-mugs', 'Mugs aux couleurs de GameZone', 'Identité visuelle'),
  gamezone('affiche-temple-du-gaming', 'Affiche « Le temple du gaming à N’Djamena »', 'Affiche & flyer'),
  gamezone('tournois-trois-jeux', 'Affiche « Tournois gaming réguliers »', 'Affiche & flyer'),
  gamezone('tournoi-call-of-duty', 'Affiche tournoi Call of Duty', 'Affiche & flyer'),
  gamezone('tournoi-mortal-kombat', 'Affiche tournoi Mortal Kombat', 'Affiche & flyer'),
  gamezone('tournoi-pes-fc', 'Affiche tournoi PES / FC', 'Affiche & flyer'),
];

export const designWorks = [
  ...gamezoneWorks,
  ...cunicoleWorks,
  {
    id: 'via-nou-post-instagram-mockup',
    title: "Publication Instagram « L'impact au-delà des mots »",
    client: VIA_NOU,
    category: 'Réseaux sociaux',
    image: `${DESIGN_DIR}/via-nou-rajaonha-post-instagram-mockup.webp`,
  },
  {
    id: 'via-nou-carte-de-visite-mockup',
    title: 'Carte de visite',
    client: VIA_NOU,
    category: 'Carte de visite',
    image: `${DESIGN_DIR}/via-nou-rajaonha-carte-de-visite-mockup.webp`,
  },
  {
    id: 'via-nou-flyer-mockup',
    title: 'Flyer « Boostez votre visibilité sur les réseaux »',
    client: VIA_NOU,
    category: 'Affiche & flyer',
    image: `${DESIGN_DIR}/via-nou-rajaonha-flyer-mockup.webp`,
  },
  {
    id: 'via-nou-post-instagram',
    title: "Publication Instagram « L'impact au-delà des mots »",
    client: VIA_NOU,
    category: 'Réseaux sociaux',
    image: `${DESIGN_DIR}/via-nou-rajaonha-post-instagram.webp`,
  },
  {
    id: 'via-nou-flyer',
    title: 'Flyer « Boostez votre visibilité sur les réseaux »',
    client: VIA_NOU,
    category: 'Affiche & flyer',
    image: `${DESIGN_DIR}/via-nou-rajaonha-flyer.webp`,
  },
  {
    id: 'via-nou-carte-de-visite',
    title: 'Carte de visite (recto)',
    client: VIA_NOU,
    category: 'Carte de visite',
    image: `${DESIGN_DIR}/via-nou-rajaonha-carte-de-visite.png`,
  },
  {
    id: 'via-nou-couverture-facebook-orange',
    title: 'Couverture Facebook, version orange',
    client: VIA_NOU,
    category: 'Réseaux sociaux',
    image: `${DESIGN_DIR}/via-nou-rajaonha-couverture-facebook-orange.png`,
  },
  {
    id: 'via-nou-couverture-facebook-verte',
    title: 'Couverture Facebook, version verte',
    client: VIA_NOU,
    category: 'Réseaux sociaux',
    image: `${DESIGN_DIR}/via-nou-rajaonha-couverture-facebook-verte.png`,
  },
];

// Montage vidéo : soit une vidéo YouTube (youtubeId = la partie après « v= » dans l'URL),
// soit un fichier .mp4 dans public/assets/portfolio/video/ (src + poster).
// {
//   id: 'spot-success-media',
//   title: 'Spot publicitaire',
//   client: 'Success Media TV',
//   category: 'Spot publicitaire',    // une des videoCategories ci-dessous
//   youtubeId: 'ABCdef12345',
//   // src: '/assets/portfolio/video/spot.mp4',
//   // poster: '/assets/portfolio/video/spot.jpg',
// },
export const videoCategories = ['Spot publicitaire', 'Clip', 'Motion design', 'Réseaux sociaux'];

export const videoWorks = [];
