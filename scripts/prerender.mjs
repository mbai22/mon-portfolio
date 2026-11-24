// Runs after `vite build`: renders the home page to HTML inside dist/index.html.
//   dist/index.html  home page, prerendered (served for "/")
//   dist/app.html    empty shell for every other route (see public/.htaccess)
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const shell = readFileSync(path.join(dist, 'index.html'), 'utf8');
const marker = '<div id="root"></div>';
if (!shell.includes(marker)) throw new Error('prerender: <div id="root"></div> not found in dist/index.html');

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const html = render('/');
if (!html.includes('<main')) throw new Error('prerender: home page rendered without <main>');

writeFileSync(path.join(dist, 'app.html'), shell);
writeFileSync(path.join(dist, 'index.html'), shell.replace(marker, `<div id="root">${html}</div>`));
rmSync(ssrDir, { recursive: true, force: true });

console.log(`prerender: home page written to dist/index.html (${Math.round(html.length / 1024)} KB of HTML)`);
