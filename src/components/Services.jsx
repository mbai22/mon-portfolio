import { useState } from 'react';
import { ChevronsRight } from 'lucide-react';
import Eyebrow from './Eyebrow';
import { useSectionNav } from '../hooks/useSectionNav';
import { useContent } from '../content/useContent';

export default function Services() {
  const { services: { categories = [], steps = [] } } = useContent();
  const [activeId, setActiveId] = useState(null);
  const goTo = useSectionNav();
  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  return (
    <section id="services" className="section section-dark">
      <div className="container">
        <div className="section-head">
          <Eyebrow>Services</Eyebrow>
          <h2 className="section-title">Des services sur mesure pour concrétiser vos idées</h2>
        </div>

        <div className="services-tabs-wrap">
          <div className="pill-tabs" role="tablist" aria-label="Catégories de services">
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
                    <span className="service-price-prefix">Dès</span>
                    <strong>{service.price}</strong>
                    <span className="service-price-unit">FCFA</span>
                  </>
                ) : (
                  <strong>Sur devis</strong>
                )}
              </div>

              <ul className="service-features">
                {(service.features ?? []).map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <a href="#contact" onClick={goTo('contact')} className="btn-pill service-btn">
                Démarrer
                <span className="circle-icon"><ChevronsRight size={16} /></span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
