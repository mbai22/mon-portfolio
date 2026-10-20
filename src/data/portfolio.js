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
export const designCategories = ['Logo', 'Identité visuelle', 'Affiche & flyer', 'Réseaux sociaux'];

export const designWorks = [];

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
