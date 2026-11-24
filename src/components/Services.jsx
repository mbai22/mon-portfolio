import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, ChevronsRight, Gauge } from 'lucide-react';
import Eyebrow from './Eyebrow';
import { useSectionNav } from '../hooks/useSectionNav';
import { useLocalizedSection } from '../content/useContent';
import { useI18n } from '../i18n/context';

export default function Services() {
  const { categories = [], steps = [] } = useLocalizedSection('services');
  const { t } = useI18n();
  const [activeId, setActiveId] = useState(null);
  const goTo = useSectionNav();
  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  return (
    <section id="services" className="section section-dark">
      <div className="container">
        <div className="section-head">
          <Eyebrow>{t('services.eyebrow')}</Eyebrow>
          <h2 className="section-title">{t('services.title')}</h2>
        </div>

        <div className="services-tabs-wrap">
          <div className="pill-tabs" role="tablist" aria-label={t('services.tabs')}>
            {categories.map((category) => (
              <button
                key={category.id}
                role="tab"
                aria-selected={category.id === active?.id}
                className={`pill-tab${category.id === active?.id ? ' active' : ''}`}
                onClick={() => setActiveId(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="services-grid">
          <ol className="services-steps">
            {steps.map((step, index) => (
              <li key={step.title} className="services-step">
                <h3 className="services-step-title display">{index + 1}. {step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>

          {(active?.services ?? []).map((service) => (
            <article key={service.title} className={`service-card${service.featured ? ' featured' : ''}`}>
              <h3 className="service-title display">{service.title}</h3>
              <p className="service-description">{service.description}</p>

              <div className="service-price">
                {service.price ? (
                  <>
                    <span className="service-price-prefix">{t('services.from')}</span>
                    <strong>{service.price}</strong>
                    <span className="service-price-unit">FCFA</span>
                  </>
                ) : (
                  <strong>{t('services.quote')}</strong>
                )}
              </div>

              <ul className="service-features">
                {(service.features ?? []).map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <a href="#contact" onClick={goTo('contact')} className="btn-pill service-btn">
                {t('services.start')}
                <span className="circle-icon"><ChevronsRight size={16} /></span>
              </a>
            </article>
          ))}
        </div>

        <div className="tool-cta-band">
          <p>
            <strong>{t('services.ctaTitle')}</strong>
            {t('services.ctaText')}
          </p>
          <div className="tool-cta-links">
            <Link to="/devis" className="btn-pill">
              {t('services.ctaEstimate')}
              <span className="circle-icon"><ChevronsRight size={16} /></span>
            </Link>
            <Link to="/rendez-vous" className="btn-ghost"><CalendarClock size={16} /> {t('services.ctaBook')}</Link>
            <Link to="/audit" className="btn-ghost"><Gauge size={16} /> {t('services.ctaAudit')}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
