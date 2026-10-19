import { useState } from 'react';
import { ChevronsRight } from 'lucide-react';
import Eyebrow from './Eyebrow';
import { useSectionNav } from '../hooks/useSectionNav';

const categories = [
  {
    id: "web",
    label: "Web",
    services: [
      {
        title: "Création de sites web",
        description: "Sites vitrines, e-commerce ou plateformes sur mesure : un site internet moderne, rapide et bien référencé sur Google.",
        price: "150 000",
        features: ["Design responsive", "SEO optimisé", "Performance rapide", "Support technique"],
        featured: true
      },
      {
        title: "Applications web & mobiles",
        description: "Développement d'applications web et mobiles sur mesure (Android, iOS, web) avec Angular, React, Laravel et API REST.",
        price: "300 000",
        features: ["Architecture scalable", "Sécurité renforcée", "Tests inclus", "Documentation"]
      }
    ]
  },
  {
    id: "design",
    label: "Design",
    services: [
      {
        title: "UI/UX Design",
        description: "Design d'interfaces web et mobiles (UI/UX) : maquettes Figma, prototypes et parcours utilisateurs.",
        features: ["Maquettes Figma", "Prototypage", "Tests utilisateurs", "Design system"],
        featured: true
      },
      {
        title: "Design graphique",
        description: "Design graphique : logos, identité visuelle, affiches, flyers et visuels pour réseaux sociaux.",
        features: ["Logo & branding", "Chartes graphiques", "Visuels réseaux", "Supports print"]
      }
    ]
  },
  {
    id: "more",
    label: "Refonte & vidéo",
    services: [
      {
        title: "Refonte de sites",
        description: "Modernisation de sites existants pour améliorer l'UX et la conversion.",
        price: "100 000",
        features: ["Audit complet", "Nouveau design", "Migration propre", "Formation incluse"],
        featured: true
      },
      {
        title: "Montage vidéo",
        description: "Montage vidéo professionnel, motion design, spots publicitaires, clips et vidéos pour réseaux sociaux.",
        features: ["Montage professionnel", "Motion design", "Color grading", "Habillage sonore"]
      }
    ]
  }
];

const steps = [
  { title: "Exprimez votre besoin", text: "Partagez vos objectifs, votre audience et vos contraintes." },
  { title: "Recevez une proposition", text: "Une solution et un devis adaptés à votre projet et à votre budget." },
  { title: "Lancez votre projet", text: "Conception, tests et livraison, avec un suivi à chaque étape." }
];

export default function Services() {
  const [activeId, setActiveId] = useState(categories[0].id);
  const goTo = useSectionNav();
  const active = categories.find((c) => c.id === activeId);

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
                aria-selected={category.id === activeId}
                className={`pill-tab${category.id === activeId ? ' active' : ''}`}
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

          {active.services.map((service) => (
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
                {service.features.map((feature) => (
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
