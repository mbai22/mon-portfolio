import { useEffect, useState } from 'react';
import { AlertTriangle, ChevronsRight, Gauge, Lock, LockOpen, Search } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { usePageMeta } from '../hooks/usePageMeta';
import { trackEvent } from '../content/track';
import { WHATSAPP_NUMBER } from '../data/social';
import { useI18n } from '../i18n/context';

const SCORE_KEYS = ['performance', 'seo', 'accessibility', 'bestPractices'];
const level = (s) => (s == null ? 'na' : s >= 90 ? 'good' : s >= 50 ? 'mid' : 'bad');

function ScoreRing({ label, score }) {
  const { t } = useI18n();
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
      <span className="audit-score-verdict">{t(`audit.verdict.${level(score)}`)}</span>
    </div>
  );
}

export default function AuditPage() {
  const { t, locale } = useI18n();
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
      const res = await fetch('/api/audit.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url, locale }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || t('audit.error'));
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
      <PageHeader eyebrow={t('audit.eyebrow')} title={t('audit.title')}
        text={t('audit.text')}>
        <form className="audit-form" onSubmit={run}>
          <label className="sr-only" htmlFor="audit-url">{t('audit.url')}</label>
          <Search size={18} aria-hidden="true" />
          <input id="audit-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="monentreprise.td" required
            inputMode="url" autoComplete="url" spellCheck="false" maxLength={200} />
          <button className="btn-pill" disabled={state.status === 'loading' || !available}>
            {state.status === 'loading' ? t('audit.analyzing') : t('audit.analyze')}
            <span className="circle-icon"><ChevronsRight size={16} /></span>
          </button>
        </form>
        {!available && (
          <p className="tool-help audit-off">{t('audit.off')} <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer">{t('audit.offLink')}</a>{t('audit.offEnd')}</p>
        )}
      </PageHeader>

      {state.status !== 'idle' && (
        <section className="section section-light tool-section" aria-live="polite">
          <div className="container">
            {state.status === 'loading' && (
              <div className="audit-loading">
                <Gauge size={34} className="spin" />
                <p><strong>{t('audit.loadingTitle')}</strong><br />{t('audit.loadingText')}</p>
              </div>
            )}
            {state.status === 'error' && <p className="tool-error audit-error"><AlertTriangle size={18} /> {state.error}</p>}
            {result && (
              <div className="audit-report">
                <div className="audit-head">
                  <div>
                    <p className="audit-url">{result.https ? <Lock size={15} /> : <LockOpen size={15} />} {result.url}</p>
                    <p className="tool-help">{result.https ? t('audit.secure') : t('audit.insecure')} {t('audit.mobile')}</p>
                  </div>
                  {result.screenshot && <img className="audit-shot" src={result.screenshot} alt={t('audit.shot')} />}
                </div>

                <div className="audit-scores">
                  {SCORE_KEYS.map((k) => <ScoreRing key={k} label={t(`audit.scores.${k}`)} score={result.scores[k]} />)}
                </div>

                <div className="audit-cols">
                  <div className="tool-card">
                    <h2 className="audit-title display">{t('audit.loadTitle')}</h2>
                    <ul className="audit-metrics">
                      {result.metrics.map((m) => (
                        <li key={m.label} className={level(m.score == null ? null : m.score * 100)}>
                          <span>{m.label}</span><strong>{m.value}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="tool-card">
                    <h2 className="audit-title display">{t('audit.fixTitle')}</h2>
                    {result.issues.length ? (
                      <ol className="audit-issues">
                        {result.issues.map((i) => (
                          <li key={i.title}>
                            <span className="audit-tag">{t(`audit.cats.${i.category}`)}</span>
                            <span>{i.title}{i.detail && <em> · {i.detail}</em>}</span>
                          </li>
                        ))}
                      </ol>
                    ) : <p className="tool-help">{t('audit.nothing')}</p>}
                  </div>
                </div>

                <div className="tool-cta-band audit-cta">
                  <p><strong>{t('audit.ctaTitle')}</strong>{t('audit.ctaText')}</p>
                  <a className="btn-pill quote-send" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon size={18} /> {t('audit.ctaBtn')}
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
