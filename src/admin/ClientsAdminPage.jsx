import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Copy, ExternalLink, Loader2, Plus, Save, Trash2, Upload } from 'lucide-react';
import { PageHead } from './pages';
import { adminGet, adminSend, uploadImage } from './api';

const STATUSES = [
  ['todo', 'À venir'], ['doing', 'En cours'], ['review', 'À valider par le client'], ['done', 'Terminé'],
];
const TEMPLATE_STEPS = ['Cadrage et devis', 'Maquettes', 'Développement', 'Tests et corrections', 'Mise en ligne et formation'];
const blank = () => ({
  client: '', phone: '', project: '', summary: '', startDate: new Date().toISOString().slice(0, 10), dueDate: '',
  amount: 0, paid: 0, notes: '', deliverables: [],
  steps: TEMPLATE_STEPS.map((title, i) => ({ id: `s${i + 1}`, title, note: '', status: i === 0 ? 'doing' : 'todo' })),
});
const linkFor = (p) => `${window.location.origin}/client/${p.token}`;
const nf = new Intl.NumberFormat('fr-FR');

function Rows({ items, onChange, render, add, addLabel }) {
  const move = (i, d) => {
    const n = [...items];
    [n[i], n[i + d]] = [n[i + d], n[i]];
    onChange(n);
  };
  return (
    <div className="adm-rows">
      {items.map((it, i) => (
        <div key={i} className="adm-row">
          <div className="adm-row-body">{render(it, (patch) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x))))}</div>
          <div className="adm-row-tools">
            <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Monter"><ArrowUp size={14} /></button>
            <button type="button" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Descendre"><ArrowDown size={14} /></button>
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label="Retirer"><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
      <button type="button" className="adm-btn adm-btn-secondary" onClick={() => onChange([...items, add()])}><Plus size={15} /> {addLabel}</button>
    </div>
  );
}

function FileRow({ item, set }) {
  const [busy, setBusy] = useState(false);
  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    try {
      const { url } = await uploadImage(file);
      set({ url, title: item.title || file.name });
    } catch (err) {
      window.alert(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="adm-inline-fields">
      <input className="adm-input" placeholder="Titre (ex. Maquette page d’accueil)" value={item.title} onChange={(e) => set({ title: e.target.value })} />
      <input className="adm-input" placeholder="Lien https://… (Google Drive, WeTransfer…)" value={item.url} onChange={(e) => set({ url: e.target.value })} />
      <label className="adm-btn adm-btn-secondary" title="Envoyer une image">
        {busy ? <Loader2 size={15} className="adm-spin" /> : <Upload size={15} />}
        <input type="file" accept="image/*" hidden onChange={pick} />
      </label>
    </div>
  );
}

function Editor({ initial, onSaved, onDeleted, onDirty }) {
  const [p, setP] = useState(initial);
  const [reply, setReply] = useState('');
  const [state, setState] = useState({ busy: false, msg: '', err: '' });
  const dirty = JSON.stringify(p) !== JSON.stringify(initial) || reply.trim() !== '';
  const set = (k) => (e) => setP({ ...p, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value });

  useEffect(() => { onDirty('clients', dirty); }, [dirty, onDirty]);
  useEffect(() => () => onDirty('clients', false), [onDirty]);

  const save = async () => {
    setState({ busy: true, msg: '', err: '' });
    try {
      const { project } = await adminSend('/api/clients.php', p.id ? 'PUT' : 'POST', { project: { ...p, reply } });
      setReply('');
      setState({ busy: false, msg: 'Enregistré', err: '' });
      onSaved(project);
    } catch (e) {
      setState({ busy: false, msg: '', err: e.message });
    }
  };

  const remove = async () => {
    if (!window.confirm(`Supprimer définitivement le projet « ${p.project} » et son espace client ?`)) return;
    await adminSend(`/api/clients.php?id=${p.id}`, 'DELETE');
    onDeleted(p.id);
  };

  const copy = () => navigator.clipboard?.writeText(linkFor(p)).then(() => setState((s) => ({ ...s, msg: 'Lien copié' })));
  const share = p.token && p.phone
    ? `https://wa.me/${p.phone.replace(/\D/g, '').replace(/^(?!235)(\d{8})$/, '235$1')}?text=${encodeURIComponent(`Bonjour ${p.client}, voici votre espace pour suivre le projet « ${p.project} » : ${linkFor(p)}`)}`
    : null;

  return (
    <div className="adm-form-pane">
      <div className="adm-form-head">
        <h3>{p.project || 'Nouveau projet'}</h3>
        <div className="adm-form-head-actions">
          {p.id && <button type="button" className="adm-icon-btn danger" onClick={remove} aria-label="Supprimer"><Trash2 size={16} /></button>}
        </div>
      </div>

      {p.token && (
        <div className="adm-share">
          <code>{linkFor(p)}</code>
          <button type="button" className="adm-btn adm-btn-secondary" onClick={copy}><Copy size={15} /> Copier</button>
          <a className="adm-btn adm-btn-secondary" href={linkFor(p)} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Ouvrir</a>
          {share && <a className="adm-btn adm-btn-primary" href={share} target="_blank" rel="noreferrer">Envoyer sur WhatsApp</a>}
        </div>
      )}
      {!p.token && <p className="adm-help">Le lien privé du client sera créé à l’enregistrement.</p>}

      <div className="adm-inline-fields">
        <label className="adm-field"><span className="adm-label">Client *</span><input className="adm-input" value={p.client} onChange={set('client')} /></label>
        <label className="adm-field"><span className="adm-label">WhatsApp du client</span><input className="adm-input" value={p.phone} onChange={set('phone')} placeholder="+235 …" /></label>
      </div>
      <label className="adm-field"><span className="adm-label">Projet *</span><input className="adm-input" value={p.project} onChange={set('project')} /></label>
      <label className="adm-field"><span className="adm-label">Description (visible par le client)</span><textarea className="adm-input adm-textarea" rows={3} value={p.summary} onChange={set('summary')} /></label>
      <div className="adm-inline-fields">
        <label className="adm-field"><span className="adm-label">Début</span><input type="date" className="adm-input" value={p.startDate} onChange={set('startDate')} /></label>
        <label className="adm-field"><span className="adm-label">Livraison prévue</span><input type="date" className="adm-input" value={p.dueDate} onChange={set('dueDate')} /></label>
        <label className="adm-field"><span className="adm-label">Montant (FCFA)</span><input type="number" min="0" step="5000" className="adm-input" value={p.amount} onChange={set('amount')} /></label>
        <label className="adm-field"><span className="adm-label">Déjà payé (FCFA)</span><input type="number" min="0" step="5000" className="adm-input" value={p.paid} onChange={set('paid')} /></label>
      </div>

      <h4 className="adm-subtitle">Étapes</h4>
      <p className="adm-help">Mettez une étape « À valider par le client » : il verra un bouton pour l’approuver, et vous recevrez un e-mail.</p>
      <Rows items={p.steps} onChange={(steps) => setP({ ...p, steps })} addLabel="Ajouter une étape"
        add={() => ({ id: `s${Date.now()}`, title: '', note: '', status: 'todo' })}
        render={(s, upd) => (
          <>
            <div className="adm-inline-fields">
              <input className="adm-input" placeholder="Titre de l’étape" value={s.title} onChange={(e) => upd({ title: e.target.value })} />
              <select className="adm-input" value={s.status} onChange={(e) => upd({ status: e.target.value })}>
                {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <input className="adm-input adm-input-sm" placeholder="Note pour le client (facultatif)" value={s.note} onChange={(e) => upd({ note: e.target.value })} />
          </>
        )} />

      <h4 className="adm-subtitle">Fichiers et livrables</h4>
      <Rows items={p.deliverables} onChange={(deliverables) => setP({ ...p, deliverables })} addLabel="Ajouter un fichier"
        add={() => ({ title: '', url: '' })} render={(f, upd) => <FileRow item={f} set={upd} />} />

      <h4 className="adm-subtitle">Messages</h4>
      <div className="client-messages adm-messages">
        {(p.messages || []).length === 0 && <p className="adm-help">Aucun message pour l’instant.</p>}
        {(p.messages || []).map((m, i) => (
          <p key={i} className={`chat-msg ${m.from === 'willy' ? 'user' : 'assistant'}`}>
            {m.text}<small>{m.from === 'willy' ? 'Vous' : p.client} · {new Date(m.at).toLocaleString('fr-FR')}</small>
          </p>
        ))}
      </div>
      <label className="adm-field"><span className="adm-label">Répondre (envoyé à l’enregistrement)</span>
        <textarea className="adm-input adm-textarea" rows={2} value={reply} onChange={(e) => setReply(e.target.value)} />
      </label>

      <label className="adm-field"><span className="adm-label">Notes privées (jamais visibles par le client)</span><textarea className="adm-input adm-textarea" rows={3} value={p.notes} onChange={set('notes')} /></label>

      <div className="adm-form-foot">
        {state.err && <span className="adm-field-error">{state.err}</span>}
        {state.msg && <span className="adm-help">{state.msg}</span>}
        <button type="button" className="adm-btn adm-btn-accent" disabled={state.busy || !dirty} onClick={save}>
          {state.busy ? <Loader2 size={16} className="adm-spin" /> : <Save size={16} />} Enregistrer
        </button>
      </div>
    </div>
  );
}

export default function ClientsAdminPage({ onDirty }) {
  const [list, setList] = useState(null);
  const [error, setError] = useState('');
  const [current, setCurrent] = useState(null); // project object or blank()
  const [key, setKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    adminGet('/api/clients.php')
      .then((d) => { if (!cancelled) setList(d.projects || []); })
      .catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, []);

  const open = useCallback((p) => {
    if (current && !window.confirm('Changer de projet ? Les modifications non enregistrées seront perdues.')) return;
    setCurrent(p);
    setKey((k) => k + 1);
  }, [current]);

  const onSaved = (saved) => {
    setList((l) => (l.some((x) => x.id === saved.id) ? l.map((x) => (x.id === saved.id ? saved : x)) : [saved, ...l]));
    setCurrent(saved);
    setKey((k) => k + 1);
  };

  return (
    <>
      <PageHead title="Espace client" description="Un lien privé par projet : le client suit l’avancement, valide les étapes, récupère ses fichiers et vous écrit. Vous êtes prévenu par e-mail." />
      {error && <p className="adm-field-error">{error}</p>}
      <div className="adm-list-editor">
        <div className="adm-list-pane">
          <div className="adm-list-tools">
            <button type="button" className="adm-btn adm-btn-primary" onClick={() => open(blank())}>
              <Plus size={16} /> Nouveau projet
            </button>
          </div>
          {!list && !error && <p className="adm-empty"><Loader2 size={16} className="adm-spin" /></p>}
          {list && list.length === 0 && <p className="adm-empty">Aucun projet client pour l’instant.</p>}
          <ol className="adm-items">
            {(list || []).map((p) => {
              const steps = p.steps || [];
              const pct = steps.length ? Math.round((steps.filter((s) => s.status === 'done').length / steps.length) * 100) : 0;
              const unread = (p.messages || []).length && p.messages[p.messages.length - 1].from === 'client';
              return (
                <li key={p.id} className={`adm-item${current?.id === p.id ? ' active' : ''}`}>
                  <button type="button" className="adm-item-main" onClick={() => open(p)}>
                    <span className="adm-item-text">
                      <span className="adm-item-title">{p.project}{unread ? ' · 💬' : ''}</span>
                      <span className="adm-item-sub">{p.client} · {pct} % · reste {nf.format(Math.max(0, (p.amount || 0) - (p.paid || 0)))} FCFA</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
        {current ? (
          <Editor key={key} initial={current} onSaved={onSaved} onDirty={onDirty}
            onDeleted={(id) => { setList((l) => l.filter((x) => x.id !== id)); setCurrent(null); }} />
        ) : <div className="adm-form-pane"><p className="adm-empty">Choisissez un projet ou créez-en un.</p></div>}
      </div>
    </>
  );
}
