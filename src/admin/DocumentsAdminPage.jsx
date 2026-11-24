import { useEffect, useState } from 'react';
import { Copy, FileText, Loader2, Plus, Printer, Receipt, Save, Send, Trash2 } from 'lucide-react';
import { PageHead } from './pages';
import { adminGet, adminSend } from './api';
import DocumentView from '../components/DocumentView';
import { DOC_STATUS, docTotals, fcfa } from '../components/docUtils';

const today = () => new Date().toISOString().slice(0, 10);
const inDays = (n) => new Date(Date.now() + n * 86400e3).toISOString().slice(0, 10);
const blank = (type) => ({
  type, status: 'draft', date: today(), dueDate: inDays(type === 'invoice' ? 15 : 30), title: '',
  client: { name: '', phone: '', email: '', address: '' }, projectId: '',
  lines: [{ label: '', qty: 1, price: 0 }], discount: 0, taxRate: 0, deposit: type === 'quote' ? 50 : 0, paid: 0,
  notes: type === 'quote'
    ? 'Devis valable 30 jours. Acompte à la commande, solde à la livraison. Deux séries de retouches incluses.'
    : 'Paiement à réception de la facture.',
});
const linkFor = (d) => `${window.location.origin}/document/${d.token}`;
const waPhone = (p) => p.replace(/\D/g, '').replace(/^(?!235)(\d{8})$/, '235$1');

const ISSUER_FIELDS = [
  ['name', 'Nom ou raison sociale', 'Willy Dev'], ['activity', 'Activité', 'Développement web & mobile, design graphique, montage vidéo'],
  ['address', 'Adresse', "N'Djamena, Tchad"], ['phone', 'Téléphone', '+235 87 26 88 96'], ['email', 'E-mail', 'contact@willydev.online'],
  ['website', 'Site', 'willydev.online'], ['nif', 'NIF', ''], ['rccm', 'RCCM', ''],
];

function IssuerCard({ issuer, onSaved }) {
  const [form, setForm] = useState(issuer);
  const [state, setState] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const save = () => adminSend('/api/documents.php', 'PUT', { issuer: form })
    .then((d) => { onSaved(d.issuer); setState('Enregistré'); })
    .catch((e) => setState(e.message));

  return (
    <details className="adm-card adm-details" open={!issuer.name}>
      <summary className="adm-card-title">Vos coordonnées sur les documents</summary>
      <div className="adm-inline-fields">
        {ISSUER_FIELDS.map(([k, label, ph]) => (
          <label key={k} className="adm-field"><span className="adm-label">{label}</span>
            <input className="adm-input" value={form[k] || ''} placeholder={ph} onChange={set(k)} />
          </label>
        ))}
      </div>
      <label className="adm-field"><span className="adm-label">Modalités de paiement (affichées sur chaque document)</span>
        <textarea className="adm-input adm-textarea" rows={3} value={form.payment || ''} onChange={set('payment')}
          placeholder={'Airtel Money : +235 …\nMoov Money : +235 …\nVirement : banque, IBAN…'} />
      </label>
      <label className="adm-field"><span className="adm-label">Pied de page</span>
        <input className="adm-input" value={form.footer || ''} onChange={set('footer')} placeholder="Merci pour votre confiance !" />
      </label>
      <div className="adm-form-foot">
        {state && <span className="adm-help">{state}</span>}
        <button type="button" className="adm-btn adm-btn-accent" onClick={save}><Save size={16} /> Enregistrer</button>
      </div>
    </details>
  );
}

function Editor({ initial, issuer, projects, onSaved, onDeleted, onDirty }) {
  const [d, setD] = useState(initial);
  const [state, setState] = useState({ busy: false, msg: '', err: '' });
  const dirty = JSON.stringify(d) !== JSON.stringify(initial);
  const set = (k, v) => setD({ ...d, [k]: v });
  const setClient = (k) => (e) => setD({ ...d, client: { ...d.client, [k]: e.target.value } });
  const setLine = (i, k, v) => set('lines', d.lines.map((l, j) => (j === i ? { ...l, [k]: v } : l)));
  const t = docTotals(d);

  useEffect(() => { onDirty('documents', dirty); }, [dirty, onDirty]);
  useEffect(() => () => onDirty('documents', false), [onDirty]);

  const call = async (fn, okMsg) => {
    setState({ busy: true, msg: '', err: '' });
    try {
      const res = await fn();
      setState({ busy: false, msg: okMsg, err: '' });
      return res;
    } catch (e) {
      setState({ busy: false, msg: '', err: e.message });
      return null;
    }
  };

  const save = (patch = {}) => call(async () => {
    const { doc } = await adminSend('/api/documents.php', d.id ? 'PUT' : 'POST', { doc: { ...d, ...patch } });
    onSaved(doc);
    return doc;
  }, 'Enregistré');

  const pickProject = (id) => {
    const p = projects.find((x) => x.id === id);
    setD({ ...d, projectId: id, client: p ? { ...d.client, name: d.client.name || p.client, phone: d.client.phone || p.phone } : d.client, title: d.title || p?.project || '' });
  };

  const share = async () => {
    const doc = d.status === 'draft' ? await save({ status: 'sent' }) : d;
    if (!doc) return;
    const text = `Bonjour ${doc.client.name}, voici ${doc.type === 'invoice' ? 'votre facture' : 'votre devis'} ${doc.number} (${fcfa(docTotals(doc).total)}) : ${linkFor(doc)}`;
    window.open(doc.client.phone ? `https://wa.me/${waPhone(doc.client.phone)}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  const convert = () => call(async () => {
    const { doc } = await adminSend('/api/documents.php', 'POST', { action: 'convert', id: d.id });
    onSaved(doc, true);
    return doc;
  }, 'Facture créée');

  const remove = async () => {
    if (!window.confirm(`Supprimer définitivement ${d.number || 'ce document'} ?`)) return;
    await adminSend(`/api/documents.php?id=${d.id}`, 'DELETE');
    onDeleted(d.id);
  };

  return (
    <div className="adm-form-pane">
      <div className="adm-form-head">
        <h3>{d.type === 'invoice' ? 'Facture' : 'Devis'} {d.number || '(nouveau)'}</h3>
        <div className="adm-form-head-actions">
          {d.id && <button type="button" className="adm-icon-btn danger" onClick={remove} aria-label="Supprimer"><Trash2 size={16} /></button>}
        </div>
      </div>

      <div className="adm-inline-fields">
        <label className="adm-field"><span className="adm-label">Statut</span>
          <select className="adm-input" value={d.status} onChange={(e) => set('status', e.target.value)}>
            {Object.entries(DOC_STATUS).filter(([k]) => d.type === 'invoice' ? !['accepted', 'refused'].includes(k) : k !== 'paid')
              .map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="adm-field"><span className="adm-label">Projet (espace client)</span>
          <select className="adm-input" value={d.projectId} onChange={(e) => pickProject(e.target.value)}>
            <option value="">Aucun</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.client} · {p.project}</option>)}
          </select>
        </label>
        <label className="adm-field"><span className="adm-label">Date</span><input type="date" className="adm-input" value={d.date} onChange={(e) => set('date', e.target.value)} /></label>
        <label className="adm-field"><span className="adm-label">{d.type === 'invoice' ? 'Échéance' : 'Valable jusqu’au'}</span><input type="date" className="adm-input" value={d.dueDate} onChange={(e) => set('dueDate', e.target.value)} /></label>
      </div>
      {d.projectId && <p className="adm-help">Visible par le client dans son espace dès que le document n’est plus un brouillon.</p>}

      <label className="adm-field"><span className="adm-label">Objet</span><input className="adm-input" value={d.title} onChange={(e) => set('title', e.target.value)} placeholder="Ex. Création du site vitrine de la Boutique X" /></label>

      <h4 className="adm-subtitle">Client</h4>
      <div className="adm-inline-fields">
        <input className="adm-input" placeholder="Nom / entreprise *" value={d.client.name} onChange={setClient('name')} />
        <input className="adm-input" placeholder="Téléphone / WhatsApp" value={d.client.phone} onChange={setClient('phone')} />
        <input className="adm-input" placeholder="E-mail" value={d.client.email} onChange={setClient('email')} />
        <input className="adm-input" placeholder="Adresse" value={d.client.address} onChange={setClient('address')} />
      </div>

      <h4 className="adm-subtitle">Lignes</h4>
      <div className="adm-doc-lines">
        <div className="adm-doc-line head"><span>Désignation</span><span>Qté</span><span>Prix unitaire (FCFA)</span><span>Montant</span><span /></div>
        {d.lines.map((l, i) => (
          <div key={i} className="adm-doc-line">
            <input className="adm-input" value={l.label} placeholder="Ex. Maquettes Figma (5 pages)" onChange={(e) => setLine(i, 'label', e.target.value)} />
            <input className="adm-input" type="number" min="0" step="0.5" value={l.qty} onChange={(e) => setLine(i, 'qty', Number(e.target.value))} />
            <input className="adm-input" type="number" min="0" step="5000" value={l.price} onChange={(e) => setLine(i, 'price', Number(e.target.value))} />
            <span className="adm-doc-amount">{fcfa(l.qty * l.price)}</span>
            <button type="button" className="adm-icon-btn" aria-label="Retirer la ligne" onClick={() => set('lines', d.lines.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
          </div>
        ))}
        <button type="button" className="adm-btn adm-btn-secondary" onClick={() => set('lines', [...d.lines, { label: '', qty: 1, price: 0 }])}><Plus size={15} /> Ajouter une ligne</button>
      </div>

      <div className="adm-inline-fields adm-mt">
        <label className="adm-field"><span className="adm-label">Remise (FCFA)</span><input type="number" min="0" step="5000" className="adm-input" value={d.discount} onChange={(e) => set('discount', Number(e.target.value))} /></label>
        <label className="adm-field"><span className="adm-label">TVA (%)</span><input type="number" min="0" max="30" step="0.5" className="adm-input" value={d.taxRate} onChange={(e) => set('taxRate', Number(e.target.value))} /></label>
        <label className="adm-field"><span className="adm-label">Acompte (%)</span><input type="number" min="0" max="100" step="5" className="adm-input" value={d.deposit} onChange={(e) => set('deposit', Number(e.target.value))} /></label>
        {d.type === 'invoice' && <label className="adm-field"><span className="adm-label">Déjà payé (FCFA)</span><input type="number" min="0" step="5000" className="adm-input" value={d.paid} onChange={(e) => set('paid', Number(e.target.value))} /></label>}
      </div>
      <p className="adm-doc-total">Total : <strong>{fcfa(t.total)}</strong>{d.deposit > 0 && <> · acompte {fcfa(t.deposit)}</>}{d.type === 'invoice' && <> · reste {fcfa(t.remaining)}</>}</p>

      <label className="adm-field"><span className="adm-label">Conditions</span><textarea className="adm-input adm-textarea" rows={3} value={d.notes} onChange={(e) => set('notes', e.target.value)} /></label>

      <div className="adm-form-foot adm-doc-actions">
        {state.err && <span className="adm-field-error">{state.err}</span>}
        {state.msg && <span className="adm-help">{state.msg}</span>}
        {d.id && d.type === 'quote' && ['accepted', 'sent'].includes(d.status) && (
          <button type="button" className="adm-btn adm-btn-secondary" onClick={convert} disabled={state.busy || dirty}><Receipt size={15} /> Créer la facture</button>
        )}
        {d.token && d.status !== 'draft' && (
          <button type="button" className="adm-btn adm-btn-secondary" onClick={() => navigator.clipboard?.writeText(linkFor(d)).then(() => setState((s) => ({ ...s, msg: 'Lien copié' })))}><Copy size={15} /> Lien</button>
        )}
        <button type="button" className="adm-btn adm-btn-secondary" onClick={() => window.print()}><Printer size={15} /> PDF</button>
        <button type="button" className="adm-btn adm-btn-primary" onClick={share} disabled={state.busy || !d.client.name}><Send size={15} /> Envoyer sur WhatsApp</button>
        <button type="button" className="adm-btn adm-btn-accent" onClick={() => save()} disabled={state.busy || !dirty || !d.client.name}>
          {state.busy ? <Loader2 size={16} className="adm-spin" /> : <Save size={16} />} Enregistrer
        </button>
      </div>

      <h4 className="adm-subtitle">Aperçu</h4>
      <div className="adm-doc-preview"><DocumentView doc={d} issuer={issuer} /></div>
    </div>
  );
}

export default function DocumentsAdminPage({ onDirty }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [current, setCurrent] = useState(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    adminGet('/api/documents.php')
      .then((d) => { if (!cancelled) setData({ ...d, issuer: Array.isArray(d.issuer) ? {} : d.issuer }); })
      .catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, []);

  const open = (doc) => {
    if (current && !window.confirm('Changer de document ? Les modifications non enregistrées seront perdues.')) return;
    setCurrent(doc);
    setKey((k) => k + 1);
  };

  const onSaved = (doc) => {
    setData((dt) => ({ ...dt, docs: dt.docs.some((x) => x.id === doc.id) ? dt.docs.map((x) => (x.id === doc.id ? doc : x)) : [...dt.docs, doc] }));
    setCurrent(doc);
    setKey((k) => k + 1);
  };

  const docs = (data?.docs || []).filter((x) => filter === 'all' || x.type === filter).slice().reverse();
  const unpaid = (data?.docs || []).filter((x) => x.type === 'invoice' && x.status === 'sent').reduce((s, x) => s + docTotals(x).remaining, 0);

  return (
    <>
      <PageHead title="Devis & factures" description="Créez vos devis et factures en FCFA, envoyez le lien sur WhatsApp (le client peut accepter le devis et télécharger le PDF), puis transformez un devis accepté en facture." />
      {error && <p className="adm-field-error">{error}</p>}
      {!data && !error && <Loader2 size={18} className="adm-spin" />}
      {data && (
        <>
          <IssuerCard issuer={data.issuer || {}} onSaved={(issuer) => setData((d) => ({ ...d, issuer }))} />
          <div className="adm-list-editor">
            <div className="adm-list-pane">
              <div className="adm-list-tools">
                <button type="button" className="adm-btn adm-btn-primary" onClick={() => open(blank('quote'))}><FileText size={15} /> Devis</button>
                <button type="button" className="adm-btn adm-btn-secondary" onClick={() => open(blank('invoice'))}><Receipt size={15} /> Facture</button>
              </div>
              <div className="adm-tabs adm-doc-filter">
                {[['all', 'Tous'], ['quote', 'Devis'], ['invoice', 'Factures']].map(([k, l]) => (
                  <button key={k} type="button" className={filter === k ? 'active' : ''} onClick={() => setFilter(k)}>{l}</button>
                ))}
              </div>
              {unpaid > 0 && <p className="adm-help adm-doc-unpaid">À encaisser : <strong>{fcfa(unpaid)}</strong></p>}
              {docs.length === 0 && <p className="adm-empty">Aucun document.</p>}
              <ol className="adm-items">
                {docs.map((x) => (
                  <li key={x.id} className={`adm-item${current?.id === x.id ? ' active' : ''}`}>
                    <button type="button" className="adm-item-main" onClick={() => open(x)}>
                      <span className="adm-item-text">
                        <span className="adm-item-title">{x.number} · {x.client.name}</span>
                        <span className="adm-item-sub">{DOC_STATUS[x.status]} · {fcfa(docTotals(x).total)}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            {current
              ? <Editor key={key} initial={current} issuer={data.issuer || {}} projects={data.projects || []} onSaved={onSaved} onDirty={onDirty}
                  onDeleted={(id) => { setData((d) => ({ ...d, docs: d.docs.filter((x) => x.id !== id) })); setCurrent(null); }} />
              : <div className="adm-form-pane"><p className="adm-empty">Choisissez un document ou créez un devis.</p></div>}
          </div>
        </>
      )}
    </>
  );
}
