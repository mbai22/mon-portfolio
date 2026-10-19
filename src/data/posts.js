// Blog articles. `body` is a list of blocks: a string is a paragraph,
// { h2 } is a subheading and { list } a bullet list.
// Cover images must stay at least 1200 px wide (Google Discover).

const unsplash = (id, w, h) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80`;

const articles = [
  {
    slug: 'creer-application-mobile-tchad-cout-etapes',
    title: "Créer une application mobile au Tchad : étapes, délais et budget",
    description: "Combien coûte une application mobile au Tchad et comment se déroule sa création ? Les étapes, les délais réalistes et les choix qui font varier le budget, expliqués simplement.",
    category: 'Applications mobiles',
    date: '2026-10-19',
    readTime: '6 min',
    photo: '1512941937669-90a1b58e7e9c',
    imageAlt: "Smartphone affichant des applications mobiles",
    body: [
      "Livraison de repas, prise de rendez-vous, suivi des ventes d'une boutique, gestion des membres d'une association : de plus en plus de projets à N'Djamena passent par une application mobile. Les Tchadiens utilisent leur téléphone pour presque tout, et une application bien pensée peut faire gagner un temps précieux à vos clients comme à votre équipe.",
      "Mais avant de se lancer, deux questions reviennent toujours : combien ça coûte, et comment ça se passe concrètement ? Voici les réponses que je donne à mes clients, sans jargon.",

      { h2: "1. Partir du besoin, pas de la technologie" },
      "La première étape n'a rien de technique. Il s'agit de répondre clairement à trois questions : qui va utiliser l'application, quel problème elle règle pour eux, et ce qu'ils doivent pouvoir faire dès la première version.",
      "C'est souvent là que l'on gagne le plus d'argent. Beaucoup de projets démarrent avec une liste de vingt fonctionnalités alors que cinq suffisent pour lancer et tester l'idée auprès de vrais utilisateurs. On parle de version minimale, ou MVP : une application simple, propre, qui fonctionne, et que l'on enrichit ensuite en fonction des retours.",

      { h2: "2. Les étapes de création d'une application" },
      "Un projet sérieux suit généralement ce chemin :",
      {
        list: [
          "Cadrage : un échange pour définir les objectifs, les utilisateurs, les fonctionnalités prioritaires et le budget.",
          "Maquettes : les écrans sont dessinés dans Figma avant d'écrire la moindre ligne de code. Vous voyez à quoi ressemblera l'application et vous pouvez demander des changements à moindre coût.",
          "Développement : l'application mobile et, le plus souvent, un espace d'administration web pour gérer les contenus, les commandes ou les utilisateurs.",
          "Tests : sur plusieurs téléphones, y compris des modèles Android d'entrée de gamme, très répandus au Tchad.",
          "Publication : mise en ligne sur le Google Play Store et, si besoin, sur l'App Store d'Apple.",
          "Suivi : corrections, mises à jour et nouvelles fonctionnalités après le lancement.",
        ],
      },

      { h2: "3. Les réalités du terrain au Tchad" },
      "Une application pensée pour Paris ne fonctionne pas forcément bien à N'Djamena. Quelques points méritent une attention particulière :",
      {
        list: [
          "La connexion : le réseau peut être lent ou instable. L'application doit rester utilisable avec une connexion faible et, quand c'est possible, garder certaines données hors ligne.",
          "Les téléphones : la majorité des utilisateurs sont sur Android, souvent avec peu de mémoire. Une application légère sera plus souvent installée, et moins souvent désinstallée.",
          "Le coût des données : des images optimisées et des écrans sobres évitent de consommer le forfait de vos clients.",
          "Le paiement : si vous vendez en ligne, l'intégration du mobile money (Airtel Money, Moov Money) est souvent plus utile qu'un paiement par carte bancaire.",
          "La langue : selon votre public, prévoir le français et l'arabe dès le départ simplifie beaucoup les choses.",
        ],
      },

      { h2: "4. Combien coûte une application mobile ?" },
      "Il n'existe pas de prix unique, comme il n'existe pas de prix unique pour une maison. Le budget dépend surtout du nombre d'écrans, de la présence de comptes utilisateurs, des paiements, des notifications, de l'espace d'administration et des connexions avec d'autres services.",
      "Pour vous donner des repères, on peut distinguer trois grandes familles de projets :",
      {
        list: [
          "Une application vitrine ou catalogue, avec quelques écrans et un formulaire de contact : c'est la formule la plus abordable, réalisable en quelques semaines.",
          "Une application avec comptes utilisateurs, commandes ou réservations et un tableau de bord d'administration : c'est le cas le plus courant pour une PME, avec un délai de deux à trois mois.",
          "Une plateforme complète, avec paiements, géolocalisation, plusieurs types d'utilisateurs (clients, livreurs, vendeurs) : le budget et les délais sont nettement plus importants.",
        ],
      },
      "Pensez aussi aux frais annexes : le compte développeur Google Play (un paiement unique d'environ 25 dollars), le compte Apple (environ 99 dollars par an), l'hébergement du serveur et la maintenance. Un devis honnête doit les mentionner clairement.",

      { h2: "5. Application mobile ou application web ?" },
      "Ce n'est pas toujours une application à installer qu'il vous faut. Si votre objectif est d'être trouvé sur Google, de présenter vos services ou de recevoir des demandes de devis, un site ou une application web suffit souvent, pour un coût plus faible. L'application mobile prend tout son sens quand vos clients l'utilisent régulièrement : commander, suivre une livraison, consulter un compte, recevoir des notifications.",
      "Il existe aussi un entre-deux : l'application web progressive (PWA), qui s'ouvre dans le navigateur mais peut être ajoutée à l'écran d'accueil comme une vraie application. C'est une bonne option pour tester une idée avant d'investir davantage.",

      { h2: "Par où commencer ?" },
      "Notez sur une feuille ce que vos utilisateurs doivent pouvoir faire, les trois fonctionnalités dont vous ne pouvez pas vous passer, et l'enveloppe que vous êtes prêt à investir. Avec ces éléments, un développeur peut vous proposer une solution réaliste, et éventuellement découper le projet en plusieurs étapes pour étaler le budget.",
      "Je développe des applications web et mobiles pour des entreprises et des porteurs de projets à N'Djamena et ailleurs au Tchad. Si vous avez une idée, écrivez-moi : le premier échange et le devis sont gratuits.",
    ],
  },
  {
    slug: 'pourquoi-entreprise-ndjamena-besoin-site-internet',
    title: "Pourquoi une entreprise à N'Djamena a besoin d'un site internet",
    description: "Facebook et WhatsApp ne suffisent plus. Visibilité sur Google, crédibilité, demandes de devis : pourquoi un site internet est devenu indispensable pour une entreprise à N'Djamena.",
    category: 'Sites internet',
    date: '2026-10-12',
    readTime: '5 min',
    photo: '1460925895917-afdab827c52f',
    imageAlt: "Ordinateur portable affichant les statistiques d'un site internet",
    body: [
      "« J'ai déjà une page Facebook et un numéro WhatsApp, pourquoi est-ce que j'aurais besoin d'un site ? » C'est une question que l'on me pose souvent, et elle est légitime. Les réseaux sociaux sont indispensables au Tchad, et beaucoup d'entreprises y trouvent une bonne partie de leurs clients.",
      "Pourtant, un site internet joue un rôle que ni Facebook ni WhatsApp ne peuvent remplir. Voici pourquoi.",

      { h2: "Vos clients vous cherchent sur Google" },
      "Quand quelqu'un cherche « plombier à N'Djamena », « agence de voyage Tchad » ou « imprimerie N'Djamena », il ouvre Google, pas Facebook. Les publications des réseaux sociaux apparaissent rarement dans ces résultats. Sans site, vous êtes tout simplement absent au moment précis où un client a besoin de vous.",
      "C'est particulièrement vrai pour les clients qui ne vous connaissent pas encore : ONG, entreprises étrangères qui s'installent, membres de la diaspora qui veulent commander un service pour leur famille. Ces personnes font leurs recherches en ligne, et elles choisissent souvent l'entreprise qu'elles trouvent en premier et qui inspire confiance.",

      { h2: "Un site rassure et inspire confiance" },
      "Un site propre, avec vos services, vos réalisations, vos coordonnées et quelques avis de clients, donne immédiatement une image sérieuse. Pour un appel d'offres, un partenariat ou un premier contrat important, c'est souvent la première chose que l'on vérifie.",
      "Une adresse e-mail professionnelle du type contact@votre-entreprise.com renforce encore cette impression. Elle fait une vraie différence face à une adresse Gmail ou Yahoo quand vous écrivez à une administration ou à une grande entreprise.",

      { h2: "Vous êtes propriétaire de votre vitrine" },
      "Sur Facebook, vous êtes locataire. Les règles changent, la portée des publications baisse, un compte peut être piraté ou suspendu du jour au lendemain. Votre site, lui, vous appartient : votre nom de domaine, vos contenus, vos textes et vos photos restent sous votre contrôle.",
      "Le bon réflexe consiste à utiliser les deux ensemble : les réseaux sociaux pour animer votre communauté et attirer l'attention, le site pour présenter votre offre en détail et transformer cette attention en demandes concrètes.",

      { h2: "Il travaille pour vous jour et nuit" },
      "Un site répond aux questions de vos clients même quand votre téléphone est éteint : horaires, tarifs indicatifs, zones de livraison, documents à fournir, foire aux questions. Vous recevez moins d'appels répétitifs et plus de demandes qualifiées, de personnes qui savent déjà ce que vous proposez.",
      "Selon votre activité, il peut aussi aller plus loin : formulaire de devis, prise de rendez-vous, catalogue de produits, commande en ligne avec paiement par mobile money, ou simplement un bouton qui ouvre directement une conversation WhatsApp avec vous.",

      { h2: "Ce qu'un bon site doit contenir" },
      "Pas besoin de cinquante pages pour commencer. Un site efficace pour une PME à N'Djamena tient souvent en quelques sections bien faites :",
      {
        list: [
          "Une présentation claire de ce que vous faites et pour qui, dès le haut de la page.",
          "Vos services ou produits principaux, avec des photos réelles plutôt que des images génériques.",
          "Quelques réalisations ou témoignages de clients.",
          "Vos coordonnées, votre localisation et un moyen simple de vous contacter, WhatsApp compris.",
          "Des textes rédigés avec les mots que vos clients tapent réellement sur Google.",
        ],
      },
      "Sur le plan technique, trois points comptent plus que tout : le site doit être rapide, même avec une connexion moyenne, parfaitement lisible sur téléphone, puisque la grande majorité des visites se font sur mobile, et bien référencé, pour apparaître dans les recherches locales.",

      { h2: "Combien de temps et quel investissement ?" },
      "Un site vitrine peut être en ligne en deux à quatre semaines, selon la rapidité avec laquelle les textes et les photos sont prêts. Il faut prévoir chaque année le renouvellement du nom de domaine et de l'hébergement, et idéalement un peu de temps pour mettre à jour les contenus.",
      "C'est un investissement modeste au regard de ce qu'il rapporte : un seul nouveau client trouvé grâce à Google suffit souvent à le rentabiliser.",

      { h2: "Passer à l'action" },
      "Si votre entreprise n'a pas encore de site, ou si votre site actuel est lent, ancien ou mal affiché sur téléphone, c'est le bon moment pour vous en occuper. Je crée des sites internet modernes et des applications web pour les entreprises de N'Djamena, du cadrage jusqu'à la mise en ligne. Contactez-moi pour en parler, le devis est gratuit.",
    ],
  },
  {
    slug: 'identite-visuelle-videos-reseaux-sociaux-entreprise-tchad',
    title: "Identité visuelle et vidéos pour les réseaux sociaux : se démarquer au Tchad",
    description: "Logo, couleurs, visuels et vidéos courtes : comment une petite entreprise au Tchad peut construire une image cohérente et attirer l'attention sur Facebook, TikTok et WhatsApp.",
    category: 'Design & vidéo',
    date: '2026-10-05',
    readTime: '6 min',
    photo: '1561070791-2526d30994b5',
    imageAlt: "Outils de design graphique : palette de couleurs, croquis et tablette",
    body: [
      "Sur Facebook, TikTok ou dans les statuts WhatsApp, vos clients voient défiler des dizaines de publications par minute. Vous avez une ou deux secondes pour retenir leur attention. Dans ce contexte, la qualité de vos visuels et de vos vidéos n'est pas un détail : c'est souvent ce qui fait la différence entre une publication ignorée et un message reçu en privé.",
      "Bonne nouvelle : il n'est pas nécessaire d'avoir le budget d'une multinationale pour avoir une image professionnelle. Il faut surtout de la cohérence.",

      { h2: "L'identité visuelle, c'est bien plus qu'un logo" },
      "Le logo est le point de départ, mais une identité visuelle comprend aussi vos couleurs, vos polices de caractères, le style de vos photos et la façon dont vous présentez vos informations. L'objectif est simple : qu'un client reconnaisse votre entreprise avant même de lire son nom.",
      "Un bon logo est simple, lisible en petit (sur une photo de profil ou un tampon) comme en grand (sur une enseigne ou une banderole), et fonctionne aussi bien en couleur qu'en noir et blanc. Évitez les dégradés compliqués et les détails trop fins qui disparaissent à l'impression.",
      "Une fois le logo prêt, une petite charte graphique de quelques pages fixe les règles : codes couleur exacts, polices, espacements, exemples d'utilisation. C'est elle qui permet de garder la même image, que vous fassiez imprimer des cartes de visite au marché ou que vous confiiez une affiche à un autre prestataire.",

      { h2: "Des visuels cohérents pour les réseaux sociaux" },
      "Sur les réseaux, la cohérence se voit tout de suite. Quand toutes vos publications utilisent les mêmes couleurs, la même typographie et la même mise en page, votre page paraît organisée et digne de confiance. À l'inverse, des visuels faits à la va-vite, chacun dans un style différent, donnent une impression d'amateurisme, même si votre service est excellent.",
      "La solution la plus efficace consiste à créer une série de modèles réutilisables :",
      {
        list: [
          "un modèle pour les promotions et les prix,",
          "un modèle pour les annonces (nouveau produit, horaires, événement),",
          "un modèle pour les témoignages de clients,",
          "des formats adaptés à chaque réseau : carré pour Facebook et Instagram, vertical pour les statuts WhatsApp, TikTok et les stories.",
        ],
      },
      "Avec ces modèles, il suffit de changer le texte et la photo pour publier régulièrement, sans repartir de zéro à chaque fois.",

      { h2: "La vidéo courte, le format qui capte l'attention" },
      "La vidéo est aujourd'hui le contenu le plus partagé sur les réseaux sociaux au Tchad comme ailleurs. Une vidéo de trente secondes montrant votre boutique, la préparation d'un plat, un chantier terminé ou un client satisfait en dit souvent plus qu'un long texte.",
      "Quelques règles font une grande différence au montage :",
      {
        list: [
          "Accrocher dès les trois premières secondes, avec une image forte ou une question.",
          "Ajouter des sous-titres : beaucoup de gens regardent sans le son, dans les transports ou au bureau.",
          "Tourner et monter en vertical pour TikTok, les reels et les statuts WhatsApp.",
          "Rester court : mieux vaut une vidéo de vingt secondes regardée jusqu'au bout qu'une vidéo de trois minutes abandonnée.",
          "Terminer par un appel à l'action clair : votre numéro, votre adresse ou « écrivez-nous sur WhatsApp ».",
          "Garder votre identité visuelle : logo discret, couleurs et typographie de votre marque dans les titres.",
        ],
      },
      "Un téléphone récent suffit souvent pour filmer. C'est le montage qui transforme des images brutes en une vidéo dynamique : choix des meilleurs plans, rythme, musique, titres animés, correction des couleurs et du son.",

      { h2: "Faire soi-même ou confier à un professionnel ?" },
      "Des outils comme Canva ou CapCut permettent de produire des contenus corrects, et ils ont toute leur place au quotidien. Mais la base, c'est-à-dire le logo, la charte graphique, les modèles de publication et les vidéos importantes comme une présentation de l'entreprise ou un spot publicitaire, mérite d'être confiée à un professionnel. Une fois ces fondations posées, votre équipe peut produire elle-même des publications régulières qui restent cohérentes.",

      { h2: "Construire une image qui vous ressemble" },
      "Une identité visuelle réussie raconte qui vous êtes : une entreprise moderne, fiable, proche de ses clients. Elle se construit une fois, puis se décline partout, de l'enseigne au site internet en passant par vos vidéos.",
      "Je réalise des logos, des identités visuelles, des visuels pour les réseaux sociaux et des montages vidéo pour les entreprises et les associations à N'Djamena. Si vous voulez donner une image plus professionnelle à votre activité, contactez-moi pour en discuter.",
    ],
  },
];

// `photo` is an Unsplash photo id: 1600 px cover for the article, smaller thumbnail for cards
export const posts = articles.map((post) => ({
  ...post,
  image: unsplash(post.photo, 1600, 900),
  thumb: unsplash(post.photo, 800, 500),
}));

export const getPost = (slug) => posts.find((post) => post.slug === slug);

export const formatDate = (iso) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
