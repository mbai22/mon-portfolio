import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronsRight, Minus, Plus } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { useLocalizedSection } from '../content/useContent';
import { usePageMeta } from '../hooks/usePageMeta';
import { trackEvent } from '../content/track';
import { WHATSAPP_NUMBER } from '../data/social';
import { useI18n } from '../i18n/context';

const fcfa = (n) => `${new Intl.NumberFormat('fr-FR').format(Math.round(n / 5000) * 5000)} FCFA`;

export default function QuotePage() {
  const estimator = useLocalizedSection('estimator');
  const { t } = useI18n();
  const types = estimator.projectTypes || [];
  const delays = estimator.delays || [];

  const [typeId, setTypeId] = useState(types[0]?.id);
  const type = types.find((t) => t.id === typeId) || types[0];
  const [pages, setPages] = useState(type?.includedPages || 0);
  const [options, setOptions] = useState([]);
  const [delayId, setDelayId] = useState(delays[0]?.id);
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');

  usePageMeta({
    title: 'Estimez le prix de votre site ou application en FCFA | Willy Dev',
    description: "Estimation gratuite et immédiate du prix d'un site internet, d'une application, d'un logo ou d'un montage vidéo à N'Djamena. Devis précis sur WhatsApp.",
    path: '/devis',
  });

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const pickType = (t) => {
    setTypeId(t.id);
    setPages(t.includedPages || 0);
    // keep only the options that apply to the new type
    setOptions((prev) => prev.filter((id) => {
      const o = (estimator.options || []).find((x) => x.id === id);
      return o && (!o.types?.length || o.types.includes(t.id));
    }));
  };

  const available = (estimator.options || []).filter((o) => !o.types?.length || o.types.includes(type?.id));
  const delay = delays.find((d) => d.id === delayId) || delays[0];

  const { low, high, lines } = useMemo(() => {
    if (!type) return { low: 0, high: 0, lines: [] };
    const out = [[type.label, Number(type.base) || 0]];
    const extraPages = type.perPage ? Math.max(0, pages - (type.includedPages || 0)) : 0;
    if (extraPages) out.push([t('quote.extraPages', { n: extraPages }), extraPages * type.perPage]);
    for (const id of options) {
      const o = available.find((x) => x.id === id);
      if (o) out.push([o.label, Number(o.price) || 0]);
    }
    let total = out.reduce((s, [, v]) => s + v, 0);
    const factor = Number(delay?.factor) || 1;
    if (factor !== 1) {
      out.push([delay.label, total * (factor - 1)]);
      total *= factor;
    }
    return { low: total, high: total * (1 + (Number(estimator.spread) || 0)), lines: out };
  }, [type, pages, options, available, delay, estimator.spread, t]);

  const message = [
    `Bonjour Willy, je souhaite un devis${name.trim() ? ` (de la part de ${name.trim()})` : ''}.`,
    '',
    `Projet : ${type?.label}`,
    type?.perPage ? `Nombre de pages : ${pages}` : null,
    options.length ? `Options : ${options.map((id) => available.find((o) => o.id === id)?.label).filter(Boolean).join(', ')}` : null,
    delay ? `Délai : ${delay.label}` : null,
    `Estimation du site : ${fcfa(low)} à ${fcfa(high)}`,
    details.trim() ? `\nDétails : ${details.trim()}` : null,
  ].filter((l) => l !== null).join('\n');

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  if (!type) return null;

  return (
    <main>
      <PageHeader eyebrow={t('quote.eyebrow')} title={t('quote.title')} text={estimator.intro} />

      <section className="section section-light tool-section">
        <div className="container quote-grid">
          <div className="quote-steps">
            <fieldset className="tool-step">
              <legend><span className="tool-step-num">1</span> {t('quote.step1')}</legend>
              <div className="quote-types">
                {types.map((pt) => (
                  <label key={pt.id} className={`quote-type${pt.id === type.id ? ' active' : ''}`}>
                    <input type="radio" name="type" checked={pt.id === type.id} onChange={() => pickType(pt)} />
                    <span className="quote-type-title display">{pt.label}</span>
                    <span className="quote-type-text">{pt.description}</span>
                    <span className="quote-type-price">{t('quote.from', { price: fcfa(pt.base) })}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {type.perPage > 0 && (
              <fieldset className="tool-step">
                <legend><span className="tool-step-num">2</span> {t('quote.step2')}</legend>
                <div className="quote-counter">
                  <button type="button" onClick={() => setPages((p) => Math.max(1, p - 1))} aria-label={t('quote.less')}><Minus size={18} /></button>
                  <output aria-live="polite"><strong>{pages}</strong> {pages > 1 ? t('quote.pages') : t('quote.page')}</output>
                  <button type="button" onClick={() => setPages((p) => Math.min(60, p + 1))} aria-label={t('quote.more')}><Plus size={18} /></button>
                </div>
                <p className="tool-help">{t('quote.pagesHelp', { n: type.includedPages, price: fcfa(type.perPage) })}</p>
              </fieldset>
            )}

            {available.length > 0 && (
              <fieldset className="tool-step">
                <legend><span className="tool-step-num">{type.perPage > 0 ? 3 : 2}</span> {t('quote.options')}</legend>
                <div className="quote-options">
                  {available.map((o) => {
                    const on = options.includes(o.id);
                    return (
                      <label key={o.id} className={`quote-option${on ? ' active' : ''}`}>
                        <input type="checkbox" checked={on}
                          onChange={() => setOptions((prev) => (on ? prev.filter((x) => x !== o.id) : [...prev, o.id]))} />
                        <span className="quote-check" aria-hidden="true">{on && <Check size={14} />}</span>
                        <span className="quote-option-label">{o.label}</span>
                        <span className="quote-option-price">+ {fcfa(o.price)}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {delays.length > 1 && (
              <fieldset className="tool-step">
                <legend><span className="tool-step-num">{(type.perPage > 0 ? 3 : 2) + (available.length ? 1 : 0)}</span> {t('quote.delay')}</legend>
                <div className="pill-tabs quote-delays">
                  {delays.map((d) => (
                    <button key={d.id} type="button" className={`pill-tab${d.id === delay.id ? ' active' : ''}`} onClick={() => setDelayId(d.id)}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
          </div>

          <aside className="quote-summary" aria-live="polite">
            <p className="quote-summary-label">{t('quote.estimate')}</p>
            <p className="quote-summary-total display">{fcfa(low)}<span> {t('quote.to')} {fcfa(high)}</span></p>
            <ul className="quote-lines">
              {lines.map(([label, value]) => (
                <li key={label}><span>{label}</span><span>{fcfa(value)}</span></li>
              ))}
            </ul>
            <label className="tool-field">
              <span>{t('quote.name')}</span>
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="name" />
            </label>
            <label className="tool-field">
              <span>{t('quote.details')}</span>
              <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={3} maxLength={600} />
            </label>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-pill quote-send" onClick={() => trackEvent('devis')}>
              <WhatsAppIcon size={18} /> {t('quote.send')}
              <span className="circle-icon"><ChevronsRight size={16} /></span>
            </a>
            <p className="tool-help">{t('quote.note')}</p>
          </aside>
        </div>
      </section>
    </main>
  );
}
