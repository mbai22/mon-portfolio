import { useEffect, useState } from 'react';
import { AlertTriangle, ChevronsRight, Gauge, Lock, LockOpen, Search } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { usePageMeta } from '../hooks/usePageMeta';
import { trackEvent } from '../content/track';
import { WHATSAPP_NUMBER } from '../data/social';

const SCORE_LABELS = { performance: 'Vitesse', seo: 'Référencement Google', accessibility: 'Accessibilité', bestPractices: 'Bonnes pratiques' };
const CATEGORY_LABELS = { performance: 'Vitesse', seo: 'Google', accessibility: 'Accessibilité', 'best-practices': 'Qualité' };
const level = (s) => (s == null ? 'na' : s >= 90 ? 'good' : s >= 50 ? 'mid' : 'bad');
const verdict = (s) => (s == null ? 'Non mesuré' : s >= 90 ? 'Très bon' : s >= 50 ? 'À améliorer' : 'Mauvais');

function ScoreRing({ label, score }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className={`audit-score ${level(score)}`}>
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <circle cx="40" cy="40" r={r} className="audit-ring-bg" />
        <circle cx="40" cy="40" r={r} className="audit-ring" strokeDasharray={c} strokeDashoffset={c * (1 - (score || 0) / 100)} />
      </svg>
      <strong>{score ?? '—'}</strong>
      <span className="audit-score-label">{label}</span>
      <span className="audit-score-verdict">{verdict(score)}</span>
    </div>
  );
}

export default function AuditPage() {
  const [url, setUrl] = useState('');
  const [state, setState] = useState({ status: 'idle' });
  const [available, setAvailable] = useState(true);

  usePageMeta({
    title: 'Audit gratuit de votre site internet : vitesse, Google, mobile | Willy Dev',
    description: "Testez gratuitement votre site : vitesse sur mobile, référencement Google, accessibilité et sécurité. Rapport immédiat et conseils d'un développeur à N'Djamena.",
    path: '/audit',
  });

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  useEffect(() => {
    fetch('/api/audit.php').then((r) => r.json()).then((d) => setAvailable(!!d.available)).catch(() => {});
  }, []);

  const run = async (e) => {
    e.preventDefault();
    setState({ status: 'loading' });
    trackEvent('audit');
    try {
      const res = await fetch('/api/audit.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'L’analyse a échoué, réessayez.');
      setState({ status: 'done', result: data });
    } catch (err) {
      setState({ status: 'error', error: err.message });
    }
  };

  const result = state.result;
  const waText = result
    ? `Bonjour Willy, j'ai fait l'audit gratuit de ${result.url} (vitesse ${result.scores.performance}/100, Google ${result.scores.seo}/100). J'aimerais l'améliorer.`
    : `Bonjour Willy, j'aimerais un audit de mon site ${url}.`;

  return (
    <main>
      <PageHeader eyebrow="Audit gratuit" title="Votre site est-il rapide et bien vu par Google ?"
        text="Entrez l’adresse de votre site : en moins d’une minute, vous saurez s’il charge vite sur mobile, s’il est bien référencé et ce qu’il faut corriger.">
        <form className="audit-form" onSubmit={run}>
          <label className="sr-only" htmlFor="audit-url">Adresse du site</label>
          <Search size={18} aria-hidden="true" />
          <input id="audit-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="monentreprise.td" required
            inputMode="url" autoComplete="url" spellCheck="false" maxLength={200} />
          <button className="btn-pill" disabled={state.status === 'loading' || !available}>
            {state.status === 'loading' ? 'Analyse…' : 'Analyser'}
            <span className="circle-icon"><ChevronsRight size={16} /></span>
          </button>
        </form>
        {!available && (
          <p className="tool-help audit-off">L’analyse automatique est momentanément indisponible. <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer">Demandez-moi un audit sur WhatsApp</a>, c’est gratuit.</p>
        )}
      </PageHeader>

      {state.status !== 'idle' && (
        <section className="section section-light tool-section" aria-live="polite">
          <div className="container">
            {state.status === 'loading' && (
              <div className="audit-loading">
                <Gauge size={34} className="spin" />
                <p><strong>Analyse en cours…</strong><br />Google charge votre site sur un téléphone simulé. Cela prend 20 à 60 secondes.</p>
              </div>
            )}
            {state.status === 'error' && <p className="tool-error audit-error"><AlertTriangle size={18} /> {state.error}</p>}
            {result && (
              <div className="audit-report">
                <div className="audit-head">
                  <div>
                    <p className="audit-url">{result.https ? <Lock size={15} /> : <LockOpen size={15} />} {result.url}</p>
                    <p className="tool-help">{result.https ? 'Connexion sécurisée (HTTPS).' : 'Attention : le site n’est pas sécurisé (pas de HTTPS). Les navigateurs l’indiquent aux visiteurs.'} Mesure sur mobile, connexion 4G lente.</p>
                  </div>
                  {result.screenshot && <img className="audit-shot" src={result.screenshot} alt="Aperçu du site sur mobile" />}
                </div>

                <div className="audit-scores">
                  {Object.entries(SCORE_LABELS).map(([k, label]) => <ScoreRing key={k} label={label} score={result.scores[k]} />)}
                </div>

                <div className="audit-cols">
                  <div className="tool-card">
                    <h2 className="audit-title display">Temps de chargement</h2>
                    <ul className="audit-metrics">
                      {result.metrics.map((m) => (
                        <li key={m.label} className={level(m.score == null ? null : m.score * 100)}>
                          <span>{m.label}</span><strong>{m.value}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="tool-card">
                    <h2 className="audit-title display">À corriger en priorité</h2>
                    {result.issues.length ? (
                      <ol className="audit-issues">
                        {result.issues.map((i) => (
                          <li key={i.title}>
                            <span className="audit-tag">{CATEGORY_LABELS[i.category]}</span>
                            <span>{i.title}{i.detail && <em> · {i.detail}</em>}</span>
                          </li>
                        ))}
                      </ol>
                    ) : <p className="tool-help">Rien d’important à signaler : bravo !</p>}
                  </div>
                </div>

                <div className="tool-cta-band audit-cta">
                  <p><strong>Je corrige tout ça pour vous</strong>Envoyez-moi ce rapport : je vous dis gratuitement ce qui est faisable et à quel prix.</p>
                  <a className="btn-pill quote-send" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon size={18} /> Envoyer sur WhatsApp
                    <span className="circle-icon"><ChevronsRight size={16} /></span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
