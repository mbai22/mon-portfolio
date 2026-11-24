# Administration du site (`/admin`)

L'espace **willydev.online/admin** permet de modifier le contenu du site sans toucher au code et sans redéployer :
projets web, design graphique, vidéos, articles de blog, témoignages, FAQ et services (tarifs en FCFA).

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

   Choisissez un mot de passe d'au moins 12 caractères. Le script crée `willydev-admin.php` (ignoré par Git),
   qui ne contient que l'empreinte (hash) du mot de passe, jamais le mot de passe lui-même.

2. **Envoyer ce fichier sur Hostinger** : hPanel → Gestionnaire de fichiers → ouvrez `domains/willydev.online/`
   (le dossier qui **contient** `public_html`, pas `public_html` lui-même) → Importer `willydev-admin.php`.

3. **Déployer le site** comme d'habitude (`npm run build`, puis le contenu de `dist/` dans `public_html`).
   Le build contient maintenant le dossier `api/` (scripts PHP de l'admin) et le `.htaccess` mis à jour.

4. Ouvrez **https://willydev.online/admin** et connectez-vous.

Pour changer de mot de passe : relancez `npm run admin:password` et remplacez le fichier sur Hostinger.

## Sécurité

- Connexion par mot de passe (hash bcrypt), session de 8 h, cookie `HttpOnly` + `Secure` + `SameSite=Strict`.
- Blocage de 15 minutes après 5 mots de passe erronés depuis la même adresse IP.
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
