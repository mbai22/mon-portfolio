import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, Circle, CircleDot, Download, Eye, Loader2, Send, Star } from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { trackEvent } from '../content/track';
import { DOC_STATUS, fcfa as fcfaDoc } from '../components/docUtils';
import { WHATSAPP_NUMBER } from '../data/social';
import { useI18n } from '../i18n/context';
import { useDateFormat } from '../content/useContent';

const fcfa = (n) => `${new Intl.NumberFormat('fr-FR').format(n || 0)} FCFA`;

const STEP_ICONS = { todo: Circle, doing: CircleDot, review: Eye, done: CheckCircle2 };

function ReviewCard({ project, busy, act }) {
  const { t } = useI18n();
  const review = project.review;
  const [rating, setRating] = useState(review?.rating || 5);
  const [text, setText] = useState(review?.text || '');
  const [role, setRole] = useState(review?.role || '');

  if (review?.status === 'approved') {
    return (
      <section className="tool-card client-review">
        <h2 className="client-title display">{t('client.thanksTitle')}</h2>
        <p className="tool-help">{t('client.thanksText')}</p>
      </section>
    );
  }

  return (
    <section className="tool-card client-review">
      <h2 className="client-title display">{t('client.reviewTitle')}</h2>
      <p className="tool-help">{review ? t('client.reviewPending') : t('client.reviewHelp')}</p>
      <form onSubmit={(e) => { e.preventDefault(); act({ action: 'review', rating, text, role }); }}>
        <div className="client-stars" role="radiogroup" aria-label={t('client.rating')}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={t('client.star', { n })} onClick={() => setRating(n)} className={n <= rating ? 'on' : ''}>
              <Star size={24} fill={n <= rating ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
        <label className="tool-field"><span>{t('client.yourReview')}</span><textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} maxLength={800} required minLength={15} /></label>
        <label className="tool-field"><span>{t('client.role')}</span><input value={role} onChange={(e) => setRole(e.target.value)} maxLength={120} placeholder={t('client.rolePh')} /></label>
        <button className="btn-pill" disabled={busy || text.trim().length < 15}>{review ? t('client.reviewUpdate') : t('client.reviewSend')}</button>
      </form>
    </section>
  );
}

function DocumentsCard({ token }) {
  const { t } = useI18n();
  const [docs, setDocs] = useState([]);
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/documents.php?client=${encodeURIComponent(token)}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { documents: [] }))
      .then((d) => { if (!cancelled) setDocs(d.documents || []); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [token]);
  if (!docs.length) return null;
  return (
    <section className="tool-card">
      <h2 className="client-title display">{t('client.docs')}</h2>
      <ul className="client-files">
        {docs.map((d) => (
          <li key={d.token}>
            <a href={`/document/${d.token}`} target="_blank" rel="noopener noreferrer">
              <Download size={16} /> {d.type === 'invoice' ? t('client.invoice') : t('client.quote')} {d.number} · {fcfaDoc(d.total)} · {DOC_STATUS[d.status]}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ClientPage() {
  const { t } = useI18n();
  const fmt = useDateFormat();
  const date = (d) => fmt(d);
  const when = (iso) => new Date(iso).toLocaleString(t('dateLocale'), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const { pathname } = useLocation();
  const token = pathname.split('/')[2] || '';
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = 'Suivi de projet | Willy Dev';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/clients.php?token=${encodeURIComponent(token)}`, { cache: 'no-store' })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.error || 'Projet introuvable.');
        return d;
      })
      .then((d) => { if (!cancelled) { setProject(d); trackEvent('client_space'); } })
      .catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [token]);

  const act = useCallback(async (payload) => {
    setBusy(true);
    setError('');
    try {
      const r = await fetch(`/api/clients.php?token=${encodeURIComponent(token)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || t('client.error'));
      setProject(d);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }, [token, t]);

  if (!project) {
    return (
      <main className="client-page">
        <div className="client-shell client-center">
          <img src="/assets/logo-hero.png" alt="Willy Dev" className="client-logo" />
          {error ? <p className="tool-error">{error}</p> : <Loader2 size={26} className="spin" />}
        </div>
      </main>
    );
  }

  const steps = project.steps || [];
  const done = steps.filter((s) => s.status === 'done').length;
  const progress = steps.length ? Math.round((done / steps.length) * 100) : 0;
  const rest = Math.max(0, (project.amount || 0) - (project.paid || 0));

  return (
    <main className="client-page">
      <header className="client-top">
        <div className="client-shell client-top-inner">
          <img src="/assets/logo-hero.png" alt="Willy Dev" className="client-logo" />
          <a className="btn-ghost" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Bonjour Willy, à propos du projet « ${project.project} » : `)}`} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={16} /> WhatsApp
          </a>
        </div>
      </header>

      <div className="client-shell">
        <section className="client-hero">
          <p className="client-kicker">{t('client.kicker')} · {project.client}</p>
          <h1 className="display">{project.project}</h1>
          {project.summary && <p className="client-summary">{project.summary}</p>}
          <div className="client-progress" aria-label={t('client.progress', { n: progress })}>
            <div className="client-progress-bar"><span style={{ width: `${progress}%` }} /></div>
            <strong>{progress} %</strong>
          </div>
          <dl className="client-facts">
            {project.startDate && <div><dt>{t('client.start')}</dt><dd>{date(project.startDate)}</dd></div>}
            {project.dueDate && <div><dt>{t('client.due')}</dt><dd>{date(project.dueDate)}</dd></div>}
            {project.amount > 0 && <div><dt>{t('client.amount')}</dt><dd>{fcfa(project.amount)}</dd></div>}
            {project.amount > 0 && <div><dt>{t('client.rest')}</dt><dd className={rest ? '' : 'ok'}>{rest ? fcfa(rest) : t('client.paidOff')}</dd></div>}
          </dl>
        </section>

        {error && <p className="tool-error client-error" role="alert">{error}</p>}

        <div className="client-grid">
          <section className="tool-card">
            <h2 className="client-title display">{t('client.steps')}</h2>
            {steps.length === 0 && <p className="tool-help">{t('client.stepsEmpty')}</p>}
            <ol className="client-steps">
              {steps.map((s) => {
                const Icon = STEP_ICONS[s.status] || Circle;
                return (
                  <li key={s.id} className={`client-step ${s.status}`}>
                    <Icon size={20} aria-hidden="true" />
                    <div>
                      <p className="client-step-title">{s.title} <span className="client-step-status">{t(`client.status.${s.status}`)}</span></p>
                      {s.note && <p className="tool-help">{s.note}</p>}
                      {s.approvedAt && <p className="tool-help">{t('client.validated', { date: date(s.approvedAt) })}</p>}
                      {s.status === 'review' && (
                        <button type="button" className="btn-pill client-approve" disabled={busy}
                          onClick={() => window.confirm(t('client.approveConfirm', { title: s.title })) && act({ action: 'approve', stepId: s.id })}>
                          {t('client.approve')}
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <div className="client-side">
            {steps.length > 0 && done === steps.length && <ReviewCard project={project} busy={busy} act={act} />}
            <DocumentsCard token={token} />

            <section className="tool-card">
              <h2 className="client-title display">{t('client.files')}</h2>
              {(project.deliverables || []).length === 0 ? <p className="tool-help">{t('client.filesEmpty')}</p> : (
                <ul className="client-files">
                  {project.deliverables.map((f) => (
                    <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer"><Download size={16} /> {f.title}</a></li>
                  ))}
                </ul>
              )}
            </section>

            <section className="tool-card">
              <h2 className="client-title display">{t('client.messages')}</h2>
              <div className="client-messages">
                {(project.messages || []).length === 0 && <p className="tool-help">{t('client.messagesEmpty')}</p>}
                {(project.messages || []).map((m, i) => (
                  <p key={i} className={`chat-msg ${m.from === 'client' ? 'user' : 'assistant'}`}>
                    {m.text}<small>{m.from === 'client' ? t('client.you') : 'Willy'} · {when(m.at)}</small>
                  </p>
                ))}
              </div>
              <form className="chat-form client-form" onSubmit={async (e) => { e.preventDefault(); if (await act({ action: 'message', text })) setText(''); }}>
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t('client.placeholder')} maxLength={2000} aria-label={t('client.placeholder')} />
                <button disabled={busy || !text.trim()} aria-label={t('client.send')}><Send size={17} /></button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
