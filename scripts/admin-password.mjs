// Creates willydev-admin.php (the admin password config) in the project root.
//   npm run admin:password
// The password is hashed with PHP's password_hash() (bcrypt); only the hash is stored.
// Upload the generated file to Hostinger ONE LEVEL ABOVE public_html (see ADMIN.md).
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import readline from 'node:readline';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'willydev-admin.php');

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.includes(question)) process.stdout.write(s); };
    rl.question(question, (answer) => { rl.close(); process.stdout.write('\n'); resolve(answer); });
  });
}

const password = await askHidden('Nouveau mot de passe admin (12 caractères minimum) : ');
if (password.length < 12) {
  console.error('Mot de passe trop court : 12 caractères minimum.');
  process.exit(1);
}
if (password !== await askHidden('Confirmez le mot de passe : ')) {
  console.error('Les deux mots de passe ne correspondent pas.');
  process.exit(1);
}

const php = spawnSync('php', ['-r', 'echo password_hash(stream_get_contents(STDIN), PASSWORD_DEFAULT);'], { input: password });
const hash = php.stdout?.toString().trim();
if (php.status !== 0 || !hash?.startsWith('$2y$')) {
  console.error("Impossible de lancer PHP. Installez PHP (ou XAMPP) et vérifiez que la commande « php » fonctionne.");
  process.exit(1);
}

writeFileSync(target, `<?php
// Willy Dev admin configuration. Keep this file private: never commit it,
// never put it inside public_html. On Hostinger it goes in the folder that
// CONTAINS public_html.
return [
    'password_hash' => '${hash}',
];
`);

console.log(`\nFichier créé : ${target}`);
console.log('Envoyez-le sur Hostinger dans le dossier qui contient public_html (voir ADMIN.md).');
