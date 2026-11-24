import { useEffect, useState } from 'react';
import { CheckCircle2, CircleAlert, Loader2, Send } from 'lucide-react';
import { PageHead } from './pages';
import { adminGet, adminSend } from './api';

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

function TelegramCard() {
  const [info, setInfo] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    let cancelled = false;
    adminGet('/api/telegram.php').then((d) => { if (!cancelled) setInfo(d); }).catch((e) => { if (!cancelled) setErr(e.message); });
    return () => { cancelled = true; };
  }, []);

  const test = () => {
    setMsg(''); setErr('');
    adminSend('/api/telegram.php', 'POST', {}).then(() => setMsg('Message de test envoyé : regardez Telegram.')).catch((e) => setErr(e.message));
  };

  return (
    <section className="adm-card">
      <div className="adm-card-head">
        <h2 className="adm-card-title">Alertes Telegram</h2>
        {info && (info.configured
          ? <span className="adm-pill ok"><CheckCircle2 size={12} /> Activé</span>
          : <span className="adm-pill warn"><CircleAlert size={12} /> Non configuré</span>)}
      </div>
      <p className="adm-help">Recevez instantanément sur votre téléphone chaque rendez-vous, message de client, avis, devis accepté et formulaire de contact (en plus de l’e-mail). Gratuit.</p>
      <ol className="adm-steps">
        <li>Dans Telegram, ouvrez <strong>@BotFather</strong>, envoyez <code>/newbot</code>, choisissez un nom : il vous donne un <strong>jeton</strong> (ex. <code>123456:ABC…</code>).</li>
        <li>Ouvrez votre nouveau bot et envoyez-lui <code>/start</code>.</li>
        <li>Ajoutez <code>{"'telegram_bot_token' => '…'"}</code> dans <code>willydev-secrets.php</code> et importez-le (voir ci-dessous), puis rechargez cette page : votre identifiant de discussion apparaît ici.</li>
        <li>Ajoutez aussi <code>{"'telegram_chat_id' => '…'"}</code> avec cet identifiant, réimportez le fichier, puis cliquez sur « Envoyer un test ».</li>
      </ol>
      {info?.hasToken && info.chats?.length > 0 && (
        <p className="adm-help adm-mt">Discussions trouvées : {info.chats.map((c) => <code key={c.id}>{c.id}</code>)} {info.chats.map((c) => c.name).filter(Boolean).join(', ')}</p>
      )}
      {info?.hasToken && !info.chats?.length && !info.configured && <p className="adm-help adm-mt">Aucune discussion trouvée : envoyez /start à votre bot puis rechargez.</p>}
      <div className="adm-form-foot">
        {err && <span className="adm-field-error">{err}</span>}
        {msg && <span className="adm-help">{msg}</span>}
        <button type="button" className="adm-btn adm-btn-secondary" onClick={test} disabled={!info?.configured}><Send size={15} /> Envoyer un test</button>
      </div>
    </section>
  );
}

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

      <TelegramCard />

      <section className="adm-card">
        <h2 className="adm-card-title">Ajouter ou changer une clé</h2>
        <ol className="adm-steps">
          <li>Sur votre ordinateur, créez un fichier texte nommé <code>willydev-secrets.php</code> avec ce contenu (gardez seulement les lignes des clés que vous avez) :
            <pre className="adm-code">{`<?php
return [
    'anthropic_api_key' => 'COLLEZ-ICI-LA-CLE-ANTHROPIC',
    'pagespeed_api_key' => 'COLLEZ-ICI-LA-CLE-GOOGLE',
    'telegram_bot_token' => 'COLLEZ-ICI-LE-JETON-DU-BOT',
    'telegram_chat_id' => 'COLLEZ-ICI-VOTRE-IDENTIFIANT',
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
