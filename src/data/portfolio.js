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
const DESIGN_DIR = '/assets/portfolio/design';

export const designWorks = [
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
