import { useEffect, useMemo, useState } from 'react';
import { CalendarCheck, ChevronsRight, Clock, Loader2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { useDateFormat, useLocalizedSection } from '../content/useContent';
import { usePageMeta } from '../hooks/usePageMeta';
import { trackEvent } from '../content/track';
import { WHATSAPP_NUMBER } from '../data/social';
import { useI18n } from '../i18n/context';

// N'Djamena is UTC+1 all year (no daylight saving time)
const OFFSET_MS = 3600 * 1000;
const pad = (n) => String(n).padStart(2, '0');
const isoDay = (d) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
const slotEpoch = (day, time) => {
  const [y, m, d] = day.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  return Date.UTC(y, m - 1, d, hh, mm) - OFFSET_MS;
};

export default function BookingPage() {
  const booking = useLocalizedSection('booking');
  const { t } = useI18n();
  const fmt = useDateFormat();
  const longDay = (day) => fmt(day, { weekday: 'long', day: 'numeric', month: 'long' });
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
      if (!res.ok) throw new Error(data.error || t('booking.error'));
      trackEvent('booking');
      setState({ status: 'done', error: '', when: `${longDay(current.iso)} ${t('booking.at')} ${time}` });
    } catch (err) {
      setState({ status: 'idle', error: err.message });
      if (/créneau/i.test(err.message)) setTime(null);
    }
  };

  if (state.status === 'done') {
    const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Bonjour Willy, je viens de réserver un appel le ${state.when}. ${form.name}`)}`;
    return (
      <main>
        <PageHeader eyebrow={t('booking.doneEyebrow')} title={t('booking.doneTitle')} text={t('booking.doneText', { when: state.when, phone: form.phone })}>
          <div className="tool-cta-links booking-done">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-pill quote-send">
              <WhatsAppIcon size={18} /> {t('booking.notifyWa')}
              <span className="circle-icon"><ChevronsRight size={16} /></span>
            </a>
          </div>
        </PageHeader>
      </main>
    );
  }

  return (
    <main>
      <PageHeader eyebrow={t('booking.eyebrow')} title={t('booking.title')} text={booking.intro} />

      <section className="section section-light tool-section">
        <div className="container booking-grid">
          <div>
            <fieldset className="tool-step">
              <legend><span className="tool-step-num">1</span> {t('booking.step1')}</legend>
              {!taken && <p className="tool-help"><Loader2 size={16} className="spin" /> {t('booking.loading')}</p>}
              {taken && days.length === 0 && <p className="tool-help">{t('booking.none')}</p>}
              <div className="booking-days">
                {days.map((d) => {
                  const date = new Date(`${d.iso}T12:00:00Z`);
                  return (
                    <button key={d.iso} type="button" className={`booking-day${current?.iso === d.iso ? ' active' : ''}`}
                      onClick={() => { setDay(d.iso); setTime(null); }} aria-pressed={current?.iso === d.iso}>
                      <span>{fmt(d.iso, { weekday: 'short' })}</span>
                      <strong>{date.getUTCDate()}</strong>
                      <span>{fmt(d.iso, { month: 'short' })}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {current && (
              <fieldset className="tool-step">
                <legend><span className="tool-step-num">2</span> {t('booking.step2')}</legend>
                <p className="tool-help booking-day-label">{longDay(current.iso)} · {t('booking.tz')} · {booking.duration || 15} min</p>
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
            <p className="booking-form-title display"><CalendarCheck size={20} /> {time && current ? `${longDay(current.iso)} ${t('booking.at')} ${time}` : t('booking.yourInfo')}</p>
            <label className="tool-field"><span>{t('booking.name')}</span><input value={form.name} onChange={set('name')} required maxLength={80} autoComplete="name" /></label>
            <label className="tool-field"><span>{t('booking.phone')}</span><input value={form.phone} onChange={set('phone')} required maxLength={30} inputMode="tel" autoComplete="tel" placeholder="+235 …" /></label>
            <label className="tool-field"><span>{t('booking.email')}</span><input type="email" value={form.email} onChange={set('email')} maxLength={120} autoComplete="email" /></label>
            <label className="tool-field"><span>{t('booking.topic')}</span>
              <select value={form.topic} onChange={set('topic')}>
                <option value="">{t('booking.choose')}</option>
                {(booking.topics || []).map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="tool-field"><span>{t('booking.message')}</span><textarea rows={3} value={form.message} onChange={set('message')} maxLength={1000} /></label>
            {/* Honeypot: hidden from people, filled by spam bots */}
            <input className="hp-field" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} aria-hidden="true" />
            {state.error && <p className="tool-error" role="alert">{state.error}</p>}
            <button className="btn-pill booking-submit" disabled={!time || state.status === 'sending'}>
              {state.status === 'sending' ? t('booking.sending') : time ? t('booking.confirm') : t('booking.pick')}
              <span className="circle-icon"><ChevronsRight size={16} /></span>
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
