# Administration du site (`/admin`)

L'espace **willydev.online/admin** permet de modifier le contenu du site sans toucher au code et sans redéployer :
projets web, design graphique, vidéos, articles de blog, témoignages, FAQ et services (tarifs en FCFA).

## Fonctionnalités

| Fonctionnalité | Page publique | Dans l'admin | Données (hors `public_html`) |
|---|---|---|---|
| Statistiques de visite (sans cookie ni IP) | toutes | Statistiques | `willydev-data/stats/AAAA-MM.json` |
| Estimateur de devis en FCFA, envoi sur WhatsApp | `/devis` | Estimateur de devis | `content.json` (section `estimator`) |
| Curseur avant / après | `/portfolio` | Avant / après | `content.json` (section `beforeAfter`) |
| Réservation d'appel découverte + e-mail | `/rendez-vous` | Rendez-vous | `willydev-data/bookings.json` |
| Audit gratuit de site (Google PageSpeed) | `/audit` | Clés & configuration | cache 12 h dans `willydev-data/audit-cache/` |
| Assistant IA (Claude) dans une bulle | toutes | Clés & configuration | aucune conversation stockée |
| Espace client privé (`/client/<lien secret>`) + e-mail | `/client/…` | Espace client | `willydev-data/clients.json` |
| Site en français, anglais et arabe (droite à gauche) | accueil | — | choix du visiteur gardé dans son navigateur |

Les traductions anglaise et arabe de la FAQ et des services sont dans `src/i18n/en.js` et `src/i18n/ar.js`.
Dès qu'une de ces sections est modifiée dans l'admin (en français), c'est la version de l'admin qui s'affiche
dans toutes les langues. Les pages Portfolio, Blog, Devis, Rendez-vous et Audit restent en français.

## Clés d'API (assistant IA et audit)

Elles ne sont **jamais** dans le code ni dans Git. Le serveur les lit dans `willydev-secrets.php`, rangé à côté de
`public_html` (même principe que `willydev-admin.php`) :

```php
<?php
return [
    'anthropic_api_key' => '…',   // console.anthropic.com → API Keys (payant à l'usage)
    'pagespeed_api_key' => '…',   // Google Cloud → PageSpeed Insights API → Identifiants (gratuit)
];
```

Importez ce fichier dans `public_html` avec le Gestionnaire de fichiers de hPanel : l'admin le déplace tout seul hors du
dossier public au premier appel (page **Clés & configuration**, qui affiche aussi l'état de chaque clé).
Sans clé, l'assistant reste masqué et la page `/audit` propose de demander l'audit sur WhatsApp.

## Comment ça marche

- Le contenu « d'origine » est dans `src/data/*.js` (livré avec le site).
- Quand une section est enregistrée depuis l'admin, elle est stockée sur le serveur dans
  `willydev-data/content.json` et **remplace** la version d'origine. Le site la charge à chaque visite.
- Le bouton **Contenu d'origine** d'une section supprime la version de l'admin et revient au contenu du code.
- Chaque enregistrement garde une copie de la version précédente (`willydev-data/backups/`, 20 dernières).
- Les images envoyées depuis l'admin sont réduites (2000 px max, WebP) puis stockées dans `willydev-data/uploads/`
  et servies à l'adresse `/uploads/...`.

`willydev-data/` et le fichier de mot de passe sont **en dehors de `public_html`** : un nouveau déploiement du site
ne les efface jamais et ils ne sont pas accessibles depuis le web.

```
domains/willydev.online/
├── public_html/            ← le site (contenu de dist/)
├── willydev-admin.php      ← mot de passe admin (à créer, voir ci-dessous)
└── willydev-data/          ← créé automatiquement au premier enregistrement
```

## Installation sur Hostinger (une seule fois)

1. **Créer le fichier de mot de passe** sur votre PC, dans le dossier du projet :

   ```powershell
   npm run admin:password
   ```

   Indiquez un nom d'utilisateur (facultatif, ni majuscules ni espaces multiples ne comptent à la connexion)
   et un mot de passe d'au moins 10 caractères. Le script crée `willydev-admin.php` (ignoré par Git),
   qui contient le nom d'utilisateur et l'empreinte (hash) du mot de passe, jamais le mot de passe lui-même.

2. **Envoyer ce fichier sur Hostinger** : hPanel → Gestionnaire de fichiers → ouvrez `domains/willydev.online/`
   (le dossier qui **contient** `public_html`, pas `public_html` lui-même) → Importer `willydev-admin.php`.

3. **Déployer le site** comme d'habitude (`npm run build`, puis le contenu de `dist/` dans `public_html`).
   Le build contient maintenant le dossier `api/` (scripts PHP de l'admin) et le `.htaccess` mis à jour.

4. Ouvrez **https://willydev.online/admin** et connectez-vous.

Pour changer de mot de passe : relancez `npm run admin:password` et remplacez le fichier sur Hostinger.

## Sécurité

- Connexion par nom d'utilisateur + mot de passe (hash bcrypt), session de 8 h,
  cookie `HttpOnly` + `Secure` + `SameSite=Strict`.
- Blocage de 15 minutes après 5 tentatives erronées depuis la même adresse IP.
- Chaque modification exige un jeton anti-CSRF lié à la session.
- Envoi d'images : JPG, PNG, WebP ou GIF uniquement (type vérifié sur le contenu réel du fichier), 8 Mo maximum.
- `/admin` et `/api/` sont exclus des moteurs de recherche (`robots.txt` + balise `noindex`).

## Développer en local

Deux terminaux :

```powershell
npm run dev:api
```

```powershell
npm run dev
```

`dev:api` lance le serveur PHP intégré (PHP / XAMPP requis) sur le port 8787, et Vite lui transmet `/api` et `/uploads`.
En local, `willydev-admin.php` et `willydev-data/` sont à la racine du projet (ignorés par Git).
Sans `dev:api`, le site fonctionne avec son contenu d'origine, mais l'admin affiche que l'API ne répond pas.

## Bon à savoir

- Le sitemap (`public/sitemap.xml`) n'est pas mis à jour automatiquement : ajoutez-y les nouveaux articles
  importants pour Google.
- Les modifications faites dans l'admin ne sont pas dans Git. Si vous voulez les intégrer au code (contenu d'origine),
  téléchargez `willydev-data/content.json` depuis Hostinger.
