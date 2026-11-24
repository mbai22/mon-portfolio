import { useEffect, useState } from 'react';
import { CheckCircle2, CircleAlert, Loader2 } from 'lucide-react';
import { PageHead } from './pages';

const FEATURES = [
  {
    id: 'chat',
    label: 'Assistant IA (bulle de discussion)',
    endpoint: '/api/chat.php',
    key: 'anthropic_api_key',
    how: 'Créez une clé sur console.anthropic.com → API Keys (compte avec moyen de paiement ; chaque conversation coûte quelques centimes).',
  },
  {
    id: 'audit',
    label: 'Audit gratuit de site (/audit)',
    endpoint: '/api/audit.php',
    key: 'pagespeed_api_key',
    how: 'Gratuite : console.cloud.google.com → API et services → activez « PageSpeed Insights API » → Identifiants → Créer une clé API (restreignez-la à cette API).',
  },
];

export default function SettingsPage() {
  const [status, setStatus] = useState({});

  useEffect(() => {
    FEATURES.forEach((f) => {
      fetch(f.endpoint, { cache: 'no-store' })
        .then((r) => r.json())
        .then((d) => setStatus((s) => ({ ...s, [f.id]: !!d.available })))
        .catch(() => setStatus((s) => ({ ...s, [f.id]: false })));
    });
  }, []);

  return (
    <>
      <PageHead title="Clés & configuration" description="Les clés d’API ne sont jamais dans le code ni dans Git : elles sont lues sur le serveur depuis un fichier privé, willydev-secrets.php, rangé à côté de public_html." />

      <section className="adm-card">
        <h2 className="adm-card-title">État</h2>
        <table className="adm-table">
          <tbody>
            {FEATURES.map((f) => (
              <tr key={f.id}>
                <td><strong>{f.label}</strong><p className="adm-help">{f.how}</p></td>
                <td className="num">
                  {status[f.id] === undefined ? <Loader2 size={16} className="adm-spin" />
                    : status[f.id]
                      ? <span className="adm-pill ok"><CheckCircle2 size={12} /> Activé</span>
                      : <span className="adm-pill warn"><CircleAlert size={12} /> Clé manquante</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="adm-card">
        <h2 className="adm-card-title">Ajouter ou changer une clé</h2>
        <ol className="adm-steps">
          <li>Sur votre ordinateur, créez un fichier texte nommé <code>willydev-secrets.php</code> avec ce contenu (gardez seulement les lignes des clés que vous avez) :
            <pre className="adm-code">{`<?php
return [
    'anthropic_api_key' => 'COLLEZ-ICI-LA-CLE-ANTHROPIC',
    'pagespeed_api_key' => 'COLLEZ-ICI-LA-CLE-GOOGLE',
];`}</pre>
          </li>
          <li>Dans hPanel → <strong>Gestionnaire de fichiers</strong> → <code>public_html</code>, importez ce fichier.</li>
          <li>Rechargez cette page : le site le range automatiquement hors de <code>public_html</code> (il n’est jamais accessible depuis le web) et la fonctionnalité passe à « Activé ».</li>
          <li>Supprimez le fichier de votre ordinateur. Ne l’envoyez jamais par WhatsApp ou e-mail et ne le mettez pas dans GitHub.</li>
        </ol>
        <p className="adm-help">Pour remplacer une clé, importez un nouveau fichier de la même façon : il remplace l’ancien.</p>
      </section>
    </>
  );
}
