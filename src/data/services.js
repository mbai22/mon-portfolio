// Offres et étapes de la section Services (modifiables depuis /admin).
// price : montant en FCFA sous forme de texte (« 150 000 »), vide = « Sur devis ».
const categories = [
  {
    id: "web",
    label: "Web",
    services: [
      {
        title: "Création de sites web",
        description: "Sites vitrines, e-commerce ou plateformes sur mesure : un site internet moderne, rapide et bien référencé sur Google.",
        price: "150 000",
        features: ["Design responsive", "SEO optimisé", "Performance rapide", "Support technique"],
        featured: true
      },
      {
        title: "Applications web & mobiles",
        description: "Développement d'applications web et mobiles sur mesure (Android, iOS, web) avec Angular, React, Laravel et API REST.",
        price: "300 000",
        features: ["Architecture scalable", "Sécurité renforcée", "Tests inclus", "Documentation"]
      }
    ]
  },
  {
    id: "design",
    label: "Design",
    services: [
      {
        title: "UI/UX Design",
        description: "Design d'interfaces web et mobiles (UI/UX) : maquettes Figma, prototypes et parcours utilisateurs.",
        features: ["Maquettes Figma", "Prototypage", "Tests utilisateurs", "Design system"],
        featured: true
      },
      {
        title: "Design graphique",
        description: "Design graphique : logos, identité visuelle, affiches, flyers et visuels pour réseaux sociaux.",
        features: ["Logo & branding", "Chartes graphiques", "Visuels réseaux", "Supports print"]
      }
    ]
  },
  {
    id: "more",
    label: "Refonte & vidéo",
    services: [
      {
        title: "Refonte de sites",
        description: "Modernisation de sites existants pour améliorer l'UX et la conversion.",
        price: "100 000",
        features: ["Audit complet", "Nouveau design", "Migration propre", "Formation incluse"],
        featured: true
      },
      {
        title: "Montage vidéo",
        description: "Montage vidéo professionnel, motion design, spots publicitaires, clips et vidéos pour réseaux sociaux.",
        features: ["Montage professionnel", "Motion design", "Color grading", "Habillage sonore"]
      }
    ]
  }
];

const steps = [
  { title: "Exprimez votre besoin", text: "Partagez vos objectifs, votre audience et vos contraintes." },
  { title: "Recevez une proposition", text: "Une solution et un devis adaptés à votre projet et à votre budget." },
  { title: "Lancez votre projet", text: "Conception, tests et livraison, avec un suivi à chaque étape." }
];

export const services = { categories, steps };
