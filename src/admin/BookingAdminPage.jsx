import { useCallback, useEffect, useState } from 'react';
import { Check, Loader2, Phone, Trash2, X } from 'lucide-react';
import { Field } from './fields';
import { PageHead, SaveBar } from './pages';
import { useDraft } from './draft';
import { adminGet, adminSend } from './api';

const WEEKDAYS = [
  { value: 1, label: 'Lundi' }, { value: 2, label: 'Mardi' }, { value: 3, label: 'Mercredi' }, { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' }, { value: 6, label: 'Samedi' }, { value: 7, label: 'Dimanche' },
];
const STATUS = {
  pending: { label: 'À confirmer', cls: 'warn' },
  confirmed: { label: 'Confirmé', cls: 'ok' },
  done: { label: 'Fait', cls: 'muted' },
  cancelled: { label: 'Annulé', cls: 'muted' },
};

const fields = [
  { name: 'intro', label: 'Texte d’introduction', type: 'textarea', rows: 3 },
  { name: 'days', label: 'Jours ouverts', type: 'checklist', options: 'weekdays' },
  { name: 'slots', label: 'Heures proposées (une par ligne, format 09:00)', type: 'lines', help: 'Heure de N’Djamena.' },
  { name: 'duration', label: 'Durée de l’appel', type: 'number', suffix: 'min', min: 5, step: 5 },
  { name: 'horizonDays', label: 'Réservable jusqu’à', type: 'number', suffix: 'jours', min: 1, max: 90 },
  { name: 'minNoticeHours', label: 'Délai minimum avant un rendez-vous', type: 'number', suffix: 'heures', min: 0, max: 168 },
  { name: 'topics', label: 'Sujets proposés (un par ligne)', type: 'lines' },
  { name: 'closedDates', label: 'Jours fermés (un par ligne, format 2026-12-25)', type: 'lines', help: 'Congés, jours fériés…' },
];

const longDate = (d) => new Date(`${d}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' });
const waLink = (phone) => `https://wa.me/${phone.replace(/[^\d]/g, '').replace(/^(?!235)(\d{8})$/, '235$1')}`;

function BookingList() {
  const [list, setList] = useState(null);
  const [error, setError] = useState('');
  const [showPast, setShowPast] = useState(false);

  const load = useCallback(() => adminGet('/api/booking.php?all=1')
    .then((d) => { setList(d.bookings || []); setError(''); })
    .catch((e) => setError(e.message)), []);

  useEffect(() => {
    let cancelled = false;
    adminGet('/api/booking.php?all=1')
      .then((d) => { if (!cancelled) setList(d.bookings || []); })
      .catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, []);

  const setStatus = (id, status) => adminSend('/api/booking.php', 'PATCH', { id, status }).then(load).catch((e) => setError(e.message));
  const remove = (b) => window.confirm(`Supprimer le rendez-vous de ${b.name} ?`)
    && adminSend(`/api/booking.php?id=${b.id}`, 'DELETE').then(load).catch((e) => setError(e.message));

  const today = new Date().toISOString().slice(0, 10);
  const shown = (list || []).filter((b) => showPast || b.date >= today);

  return (
    <section className="adm-card">
      <div className="adm-card-head">
        <h2 className="adm-card-title">Réservations</h2>
        <label className="adm-check"><input type="checkbox" checked={showPast} onChange={(e) => setShowPast(e.target.checked)} /> <span>Afficher les rendez-vous passés</span></label>
      </div>
      {error && <p className="adm-field-error">{error}</p>}
      {!list && !error && <Loader2 size={18} className="adm-spin" />}
      {list && shown.length === 0 && <p className="adm-empty">Aucun rendez-vous à venir.</p>}
      {shown.length > 0 && (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Date</th><th>Personne</th><th>Sujet</th><th>Statut</th><th /></tr></thead>
            <tbody>
              {shown.map((b) => (
                <tr key={b.id} className={b.status === 'cancelled' ? 'is-muted' : ''}>
                  <td><strong>{longDate(b.date)}</strong><br />{b.time}</td>
                  <td>
                    <strong>{b.name}</strong><br />
                    <a className="adm-link" href={waLink(b.phone)} target="_blank" rel="noreferrer"><Phone size={13} /> {b.phone}</a>
                    {b.email && <><br /><a className="adm-link" href={`mailto:${b.email}`}>{b.email}</a></>}
                  </td>
                  <td>{b.topic || '—'}{b.message && <p className="adm-help">{b.message}</p>}</td>
                  <td><span className={`adm-pill ${STATUS[b.status]?.cls}`}>{STATUS[b.status]?.label || b.status}</span></td>
                  <td className="adm-row-actions">
                    {b.status === 'pending' && <button type="button" className="adm-icon-btn" title="Confirmer" aria-label="Confirmer" onClick={() => setStatus(b.id, 'confirmed')}><Check size={16} /></button>}
                    {b.status !== 'cancelled' && b.status !== 'done' && <button type="button" className="adm-icon-btn" title="Annuler" aria-label="Annuler" onClick={() => setStatus(b.id, 'cancelled')}><X size={16} /></button>}
                    {b.status === 'confirmed' && <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setStatus(b.id, 'done')}>Fait</button>}
                    <button type="button" className="adm-icon-btn danger" title="Supprimer" aria-label="Supprimer" onClick={() => remove(b)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function BookingAdminPage({ content, customized, onSaved, onDirty }) {
  const cfg = useDraft('booking', content.booking, { onSaved, onDirty });
  const set = (k, v) => cfg.setDraft({ ...cfg.draft, [k]: v });
  const errors = (cfg.draft.slots || []).some((s) => s && !/^([01]\d|2[0-3]):[0-5]\d$/.test(s.trim()))
    ? [{ index: -1, message: 'Heures au format 09:00' }] : [];

  const save = () => cfg.save({
    ...cfg.draft,
    days: (cfg.draft.days || []).map(Number).sort(),
    slots: [...new Set((cfg.draft.slots || []).map((s) => s.trim()).filter(Boolean))].sort(),
    topics: (cfg.draft.topics || []).map((s) => s.trim()).filter(Boolean),
    closedDates: (cfg.draft.closedDates || []).map((s) => s.trim()).filter((s) => /^\d{4}-\d{2}-\d{2}$/.test(s)),
  });

  return (
    <>
      <PageHead title="Rendez-vous" description="Les appels découverte réservés depuis la page /rendez-vous. Vous recevez aussi un e-mail à chaque réservation.">
        <a className="adm-link" href="/rendez-vous" target="_blank" rel="noreferrer">Voir la page</a>
      </PageHead>
      <BookingList />
      <section className="adm-card">
        <h2 className="adm-card-title">Disponibilités</h2>
        {fields.map((f) => <Field key={f.name} field={f} item={cfg.draft} onChange={set} options={{ weekdays: WEEKDAYS }} />)}
      </section>
      <SaveBar dirty={cfg.dirty} customized={customized.has('booking')} errors={errors} onSave={save} onRevert={cfg.revert} onReset={cfg.reset} />
    </>
  );
}
