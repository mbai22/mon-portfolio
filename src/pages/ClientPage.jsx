import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, Circle, CircleDot, Download, Eye, Loader2, Send } from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { trackEvent } from '../content/track';
import { WHATSAPP_NUMBER } from '../data/social';

const fcfa = (n) => `${new Intl.NumberFormat('fr-FR').format(n || 0)} FCFA`;
const date = (d) => (d ? new Date(`${d.slice(0, 10)}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '');
const when = (iso) => new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const STEP = {
  todo: { icon: Circle, label: 'À venir' },
  doing: { icon: CircleDot, label: 'En cours' },
  review: { icon: Eye, label: 'À valider' },
  done: { icon: CheckCircle2, label: 'Terminé' },
};

export default function ClientPage() {
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
      if (!r.ok) throw new Error(d.error || 'Action impossible, réessayez.');
      setProject(d);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }, [token]);

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
          <p className="client-kicker">Espace client · {project.client}</p>
          <h1 className="display">{project.project}</h1>
          {project.summary && <p className="client-summary">{project.summary}</p>}
          <div className="client-progress" aria-label={`Avancement : ${progress} %`}>
            <div className="client-progress-bar"><span style={{ width: `${progress}%` }} /></div>
            <strong>{progress} %</strong>
          </div>
          <dl className="client-facts">
            {project.startDate && <div><dt>Début</dt><dd>{date(project.startDate)}</dd></div>}
            {project.dueDate && <div><dt>Livraison prévue</dt><dd>{date(project.dueDate)}</dd></div>}
            {project.amount > 0 && <div><dt>Montant du projet</dt><dd>{fcfa(project.amount)}</dd></div>}
            {project.amount > 0 && <div><dt>Reste à payer</dt><dd className={rest ? '' : 'ok'}>{rest ? fcfa(rest) : 'Soldé ✓'}</dd></div>}
          </dl>
        </section>

        {error && <p className="tool-error client-error" role="alert">{error}</p>}

        <div className="client-grid">
          <section className="tool-card">
            <h2 className="client-title display">Étapes du projet</h2>
            {steps.length === 0 && <p className="tool-help">Les étapes seront ajoutées très bientôt.</p>}
            <ol className="client-steps">
              {steps.map((s) => {
                const meta = STEP[s.status] || STEP.todo;
                return (
                  <li key={s.id} className={`client-step ${s.status}`}>
                    <meta.icon size={20} aria-hidden="true" />
                    <div>
                      <p className="client-step-title">{s.title} <span className="client-step-status">{meta.label}</span></p>
                      {s.note && <p className="tool-help">{s.note}</p>}
                      {s.approvedAt && <p className="tool-help">Validé le {date(s.approvedAt)}</p>}
                      {s.status === 'review' && (
                        <button type="button" className="btn-pill client-approve" disabled={busy}
                          onClick={() => window.confirm(`Valider l’étape « ${s.title} » ?`) && act({ action: 'approve', stepId: s.id })}>
                          Valider cette étape
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <div className="client-side">
            <section className="tool-card">
              <h2 className="client-title display">Fichiers</h2>
              {(project.deliverables || []).length === 0 ? <p className="tool-help">Les maquettes et livrables apparaîtront ici.</p> : (
                <ul className="client-files">
                  {project.deliverables.map((f) => (
                    <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer"><Download size={16} /> {f.title}</a></li>
                  ))}
                </ul>
              )}
            </section>

            <section className="tool-card">
              <h2 className="client-title display">Messages</h2>
              <div className="client-messages">
                {(project.messages || []).length === 0 && <p className="tool-help">Une question, une remarque sur une maquette ? Écrivez ici, Willy est prévenu par e-mail.</p>}
                {(project.messages || []).map((m, i) => (
                  <p key={i} className={`chat-msg ${m.from === 'client' ? 'user' : 'assistant'}`}>
                    {m.text}<small>{m.from === 'client' ? 'Vous' : 'Willy'} · {when(m.at)}</small>
                  </p>
                ))}
              </div>
              <form className="chat-form client-form" onSubmit={async (e) => { e.preventDefault(); if (await act({ action: 'message', text })) setText(''); }}>
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Votre message…" maxLength={2000} aria-label="Votre message" />
                <button disabled={busy || !text.trim()} aria-label="Envoyer"><Send size={17} /></button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
