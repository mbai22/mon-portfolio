import { Monitor, Smartphone, Layers, Palette, Camera, Film, Zap, Star, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCarousel } from '../hooks/useCarousel';

const services = [
  {
    icon: Monitor,
    title: "Création de Sites Web",
    description: "Sites vitrines, e-commerce ou plateformes sur mesure, modernes et performants.",
    price: "À partir de 150,000 FCFA",
    features: ["Design responsive", "SEO optimisé", "Performance rapide", "Support technique"],
    popular: true,
    color: "#fdb901"
  },
  {
    icon: Layers,
    title: "Développement d'Apps",
    description: "Applications web complexes avec Angular, Laravel et API REST.",
    price: "À partir de 300,000 FCFA",
    features: ["Architecture scalable", "Sécurité renforcée", "Tests inclus", "Documentation"],
    popular: false,
    color: "#7a00ff"
  },
  {
    icon: Smartphone,
    title: "Refonte de Sites",
    description: "Modernisation de sites existants pour améliorer UX et conversion.",
    price: "À partir de 100,000 FCFA",
    features: ["Audit complet", "Nouveau design", "Migration propre", "Formation incluse"],
    popular: false,
    color: "#fdb901"
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Design d'interfaces utilisateur modernes et expériences optimales.",
    price: "Sur devis",
    features: ["Maquettes Figma", "Prototypage", "Tests utilisateurs", "Design system"],
    popular: true,
    color: "#7a00ff"
  },
  {
    icon: Camera,
    title: "Design Graphique",
    description: "Logos, chartes graphiques, visuels pour réseaux sociaux et identité de marque.",
    price: "Sur devis",
    features: ["Logo & branding", "Chartes graphiques", "Visuels réseaux", "Supports print"],
    popular: false,
    color: "#fdb901"
  },
  {
    icon: Film,
    title: "Production Vidéo",
    description: "Montage vidéo, motion design, clips promotionnels et contenu pour réseaux sociaux.",
    price: "Sur devis",
    features: ["Montage professionnel", "Motion design", "Color grading", "Habillage sonore"],
    popular: false,
    color: "#7a00ff"
  }
];

export default function Services() {
  const { scrollRef, activeIndex, scroll, scrollTo } = useCarousel({ cardSelector: '.service-card' });

  return (
    <section id="services" className="bg-primary">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-label">Services</span>
          <h2 className="section-title">Ce que je <span className="text-orange">propose</span></h2>
          <p className="section-description">
            Des services professionnels pour transformer vos idées en solutions web performantes.
          </p>
        </div>

        {/* Services Grid */}
        <div ref={scrollRef} className="services-grid">
          {services.map((service, index) => (
            <div key={service.title} className={`service-card ${service.popular ? 'popular' : ''}`} style={{ animationDelay: `${index * 100}ms` }}>
              {/* Popular Badge */}
              {service.popular && (
                <div className="service-badge">
                  <Star size={12} />
                  Populaire
                </div>
              )}

              {/* Icon */}
              <div className="service-icon" style={{ backgroundColor: service.color }}>
                <service.icon />
              </div>

              {/* Content */}
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>

              {/* Features */}
              <ul className="service-features">
                {service.features.map((feature) => (
                  <li key={feature} className="service-feature">
                    <div className="service-feature-check">
                      <Check size={12} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Price */}
              <div className="service-price-section">
                <p className="service-price-label">Tarif</p>
                <p className="service-price">{service.price}</p>
              </div>

              {/* CTA */}
              <a href="#contact" onClick={(e) => { e.preventDefault(); window.location.hash = '#/'; setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className={`service-btn ${service.popular ? 'popular' : ''}`}>
                <Zap size={16} />
                Réserver
              </a>
            </div>
          ))}
        </div>

        <div className="carousel-nav">
          <button className="carousel-arrow" onClick={() => scroll(-1)} aria-label="Précédent">
            <ChevronLeft size={20} />
          </button>
          <button className="carousel-arrow" onClick={() => scroll(1)} aria-label="Suivant">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Navigation Dots */}
        <div className="services-dots">
          {services.map((_, index) => (
            <button
              key={index}
              className={`services-dot${index === activeIndex ? ' active' : ''}`}
              onClick={() => scrollTo(index)}
              aria-label={`Service ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
