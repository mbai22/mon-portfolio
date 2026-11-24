import { useEffect, useMemo, useState } from 'react';
import { CalendarCheck, ChevronsRight, Clock, Loader2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { useContent } from '../content/useContent';
import { usePageMeta } from '../hooks/usePageMeta';
import { trackEvent } from '../content/track';
import { WHATSAPP_NUMBER } from '../data/social';

// N'Djamena is UTC+1 all year (no daylight saving time)
const OFFSET_MS = 3600 * 1000;
const pad = (n) => String(n).padStart(2, '0');
const isoDay = (d) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
const slotEpoch = (day, time) => {
  const [y, m, d] = day.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  return Date.UTC(y, m - 1, d, hh, mm) - OFFSET_MS;
};
const longDay = (day) => new Date(`${day}T12:00:00Z`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });

export default function BookingPage() {
  const { booking } = useContent();
  const [taken, setTaken] = useState(null);
  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', topic: '', message: '', website: '' });
  const [state, setState] = useState({ status: 'idle', error: '' });

  usePageMeta({
    title: 'Réserver un appel découverte gratuit | Willy Dev',
    description: "Réservez un appel gratuit de 15 minutes avec Willy Dev pour parler de votre site, application, logo ou vidéo. N'Djamena, Tchad.",
    path: '/rendez-vous',
  });

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/booking.php', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { taken: [] }))
      .catch(() => ({ taken: [] }))
      // remember when availability was loaded: slots are computed relative to that moment
      .then((d) => { if (!cancelled) setTaken({ slots: new Set(d.taken || []), at: Date.now() }); });
    return () => { cancelled = true; };
  }, [state.status]);

  const days = useMemo(() => {
    if (!taken) return [];
    const now = taken.at;
    const local = new Date(now + OFFSET_MS);
    const open = new Set((booking.days || []).map(Number));
    const closed = new Set(booking.closedDates || []);
    const out = [];
    for (let i = 0; i <= (booking.horizonDays || 14); i++) {
      const d = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + i));
      const iso = isoDay(d);
      const weekday = d.getUTCDay() || 7;
      if (!open.has(weekday) || closed.has(iso)) continue;
      const slots = (booking.slots || []).map((t) => ({
        time: t,
        free: !taken.slots.has(`${iso} ${t}`) && slotEpoch(iso, t) > now + (booking.minNoticeHours || 0) * 3600 * 1000,
      }));
      if (slots.some((s) => s.free)) out.push({ iso, slots });
    }
    return out;
  }, [booking, taken]);

  const current = days.find((d) => d.iso === day) || days[0];
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!current || !time) return;
    setState({ status: 'sending', error: '' });
    try {
      const res = await fetch('/api/booking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date: current.iso, time }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'La réservation n’a pas abouti. Réessayez ou écrivez-moi sur WhatsApp.');
      trackEvent('booking');
      setState({ status: 'done', error: '', when: `${longDay(current.iso)} à ${time}` });
    } catch (err) {
      setState({ status: 'idle', error: err.message });
      if (/créneau/i.test(err.message)) setTime(null);
    }
  };

  if (state.status === 'done') {
    const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Bonjour Willy, je viens de réserver un appel le ${state.when}. ${form.name}`)}`;
    return (
      <main>
        <PageHeader eyebrow="Rendez-vous" title="C’est réservé !" text={`Votre appel découverte est prévu ${state.when} (heure de N'Djamena). Je vous contacte au ${form.phone}.`}>
          <div className="tool-cta-links booking-done">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-pill quote-send">
              <WhatsAppIcon size={18} /> Me prévenir sur WhatsApp
              <span className="circle-icon"><ChevronsRight size={16} /></span>
            </a>
          </div>
        </PageHeader>
      </main>
    );
  }

  return (
    <main>
      <PageHeader eyebrow="Appel découverte" title="Réservez un appel gratuit" text={booking.intro} />

      <section className="section section-light tool-section">
        <div className="container booking-grid">
          <div>
            <fieldset className="tool-step">
              <legend><span className="tool-step-num">1</span> Choisissez un jour</legend>
              {!taken && <p className="tool-help"><Loader2 size={16} className="spin" /> Chargement des disponibilités…</p>}
              {taken && days.length === 0 && <p className="tool-help">Aucun créneau libre pour le moment : écrivez-moi directement sur WhatsApp.</p>}
              <div className="booking-days">
                {days.map((d) => {
                  const date = new Date(`${d.iso}T12:00:00Z`);
                  return (
                    <button key={d.iso} type="button" className={`booking-day${current?.iso === d.iso ? ' active' : ''}`}
                      onClick={() => { setDay(d.iso); setTime(null); }} aria-pressed={current?.iso === d.iso}>
                      <span>{date.toLocaleDateString('fr-FR', { weekday: 'short', timeZone: 'UTC' })}</span>
                      <strong>{date.getUTCDate()}</strong>
                      <span>{date.toLocaleDateString('fr-FR', { month: 'short', timeZone: 'UTC' })}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {current && (
              <fieldset className="tool-step">
                <legend><span className="tool-step-num">2</span> Choisissez une heure</legend>
                <p className="tool-help booking-day-label">{longDay(current.iso)} · heure de N'Djamena · {booking.duration || 15} min</p>
                <div className="booking-slots">
                  {current.slots.map((s) => (
                    <button key={s.time} type="button" disabled={!s.free} className={`booking-slot${time === s.time ? ' active' : ''}`}
                      onClick={() => setTime(s.time)} aria-pressed={time === s.time}>
                      <Clock size={14} /> {s.time}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
          </div>

          <form className="tool-card booking-form" onSubmit={submit}>
            <p className="booking-form-title display"><CalendarCheck size={20} /> {time && current ? `${longDay(current.iso)} à ${time}` : 'Vos coordonnées'}</p>
            <label className="tool-field"><span>Nom *</span><input value={form.name} onChange={set('name')} required maxLength={80} autoComplete="name" /></label>
            <label className="tool-field"><span>Téléphone / WhatsApp *</span><input value={form.phone} onChange={set('phone')} required maxLength={30} inputMode="tel" autoComplete="tel" placeholder="+235 …" /></label>
            <label className="tool-field"><span>E-mail</span><input type="email" value={form.email} onChange={set('email')} maxLength={120} autoComplete="email" /></label>
            <label className="tool-field"><span>Sujet</span>
              <select value={form.topic} onChange={set('topic')}>
                <option value="">Choisir…</option>
                {(booking.topics || []).map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="tool-field"><span>Votre projet en quelques mots</span><textarea rows={3} value={form.message} onChange={set('message')} maxLength={1000} /></label>
            {/* Honeypot: hidden from people, filled by spam bots */}
            <input className="hp-field" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} aria-hidden="true" />
            {state.error && <p className="tool-error" role="alert">{state.error}</p>}
            <button className="btn-pill booking-submit" disabled={!time || state.status === 'sending'}>
              {state.status === 'sending' ? 'Réservation…' : time ? 'Confirmer le rendez-vous' : 'Choisissez un créneau'}
              <span className="circle-icon"><ChevronsRight size={16} /></span>
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
