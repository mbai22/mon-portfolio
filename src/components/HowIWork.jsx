import { Search, Code2, Rocket, CheckCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Analyse du besoin",
    description: "Je comprends vos objectifs, votre audience et vos contraintes pour définir la solution idéale."
  },
  {
    icon: Code2,
    number: "02",
    title: "Conception & Développement",
    description: "Je crée une architecture solide et développe votre application avec les meilleures pratiques."
  },
  {
    icon: CheckCircle,
    number: "03",
    title: "Tests & Validation",
    description: "Je teste rigoureusement chaque fonctionnalité pour garantir une qualité optimale."
  },
  {
    icon: Rocket,
    number: "04",
    title: "Livraison & Support",
    description: "Je déploie votre projet et vous accompagne pour assurer son succès."
  }
];

export default function HowIWork() {
  return (
    <section id="how-i-work" className="bg-primary">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-label">Processus</span>
          <h2 className="section-title">Comment je <span className="text-orange">travaille</span></h2>
          <p className="section-description">
            Une méthodologie éprouvée pour transformer vos idées en produits web réussis.
          </p>
        </div>

        {/* Steps */}
        <div className="how-i-work-grid">
          {steps.map((step, index) => (
            <div key={step.title} className="how-i-work-card" style={{ animationDelay: `${index * 150}ms` }}>
              {/* Step Number */}
              <div className="how-i-work-number">{step.number}</div>
              
              {/* Icon */}
              <div className="how-i-work-icon">
                <step.icon size={32} />
              </div>

              {/* Content */}
              <h3 className="how-i-work-title">{step.title}</h3>
              <p className="how-i-work-description">{step.description}</p>

              {/* Arrow (except last) */}
              {index < steps.length - 1 && (
                <div className="how-i-work-arrow">
                  <ArrowRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="how-i-work-cta">
          <p className="how-i-work-cta-text">
            Prêt à démarrer votre projet ?
          </p>
          <a href="#contact" className="btn-primary">
            Discutons ensemble
          </a>
        </div>
      </div>
    </section>
  );
}
