# Portfolio Développeur Web

Un portfolio moderne et responsive créé avec React, Vite et Framer Motion.

## 🚀 Fonctionnalités

- **Design moderne** : Interface utilisateur élégante avec animations fluides
- **Responsive** : Optimisé pour tous les appareils (desktop, tablette, mobile)
- **Animations** : Transitions et animations avec Framer Motion
- **Performance** : Chargement rapide avec Vite
- **Accessibilité** : Navigation au clavier et lecteurs d'écran
- **SEO optimisé** : Structure sémantique et métadonnées

## 📋 Sections

1. **Header** : Navigation fixe avec menu responsive
2. **Hero** : Section d'accueil avec présentation
3. **À propos** : Parcours professionnel et statistiques
4. **Compétences** : Technologies maîtrisées et soft skills
5. **Projets** : Galerie de projets avec filtres
6. **Contact** : Formulaire de contact et informations
7. **Footer** : Liens sociaux et informations complémentaires

## 🛠️ Technologies utilisées

- **React 19** : Framework JavaScript
- **Vite** : Build tool et bundler
- **Framer Motion** : Animations et transitions
- **Lucide React** : Icônes modernes
- **CSS3** : Styles personnalisés avec Flexbox et Grid
- **Responsive Design** : Mobile-first approach

## 📦 Installation

1. Clonez le repository :
```bash
git clone <url-du-repo>
cd my-react-app
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez le serveur de développement :
```bash
npm run dev
```

4. Ouvrez votre navigateur sur `http://localhost:5173`

## 🏗️ Structure du projet

```
src/
├── components/
│   ├── Header/
│   │   ├── Header.jsx
│   │   └── Header.css
│   ├── Hero/
│   │   ├── Hero.jsx
│   │   └── Hero.css
│   ├── About/
│   │   ├── About.jsx
│   │   └── About.css
│   ├── Skills/
│   │   ├── Skills.jsx
│   │   └── Skills.css
│   ├── Projects/
│   │   ├── Projects.jsx
│   │   └── Projects.css
│   ├── Contact/
│   │   ├── Contact.jsx
│   │   └── Contact.css
│   └── Footer/
│       ├── Footer.jsx
│       └── Footer.css
├── assets/
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## 🎨 Personnalisation

### Couleurs
Les couleurs principales sont définies dans les fichiers CSS :
- Primaire : `#667eea`
- Secondaire : `#764ba2`
- Texte : `#333`
- Gris : `#666`

### Contenu
Modifiez les données dans chaque composant :
- **Hero.jsx** : Nom, titre, description
- **About.jsx** : Expérience, statistiques
- **Skills.jsx** : Compétences techniques et soft skills
- **Projects.jsx** : Projets et technologies
- **Contact.jsx** : Informations de contact

### Images
Remplacez les placeholders par vos propres images :
- Photo de profil dans Hero
- Images de projets dans Projects
- Logo personnalisé dans Header

## 📱 Responsive Design

Le portfolio est optimisé pour :
- **Desktop** : 1200px et plus
- **Tablette** : 768px - 1199px
- **Mobile** : 320px - 767px

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connectez votre repository GitHub à Vercel
2. Vercel détectera automatiquement le framework
3. Déployez en un clic

### Netlify
1. Build le projet : `npm run build`
2. Uploadez le dossier `dist` sur Netlify

### GitHub Pages
1. Ajoutez `"homepage": "https://username.github.io/repo-name"` dans package.json
2. Installez gh-pages : `npm install --save-dev gh-pages`
3. Ajoutez les scripts de déploiement
4. Déployez : `npm run deploy`

## 🔧 Scripts disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Build pour la production
- `npm run preview` : Prévisualise le build
- `npm run lint` : Vérifie le code avec ESLint

## 📄 Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser et de le modifier.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Contactez-moi via le formulaire du portfolio

---

**Créé avec ❤️ en React**
