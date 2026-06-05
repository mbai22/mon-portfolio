import { useState } from 'react';
import { ExternalLink, Globe, Database, Layout, ShoppingBag, Code, Smartphone, Zap } from 'lucide-react';

const projects = [
  { 
    id: 1, 
    title: "Plateforme de Quiz Dynamique", 
    client: "Éducation Tchad", 
    type: "Application Web", 
    Icon: Layout, 
    bgColor: "#fdb901", 
    description: "Permet aux étudiants de s'entraîner par matière avec score en temps réel",
    stack: "Angular + Laravel API",
    image: "/assets/img/WhatsApp Image 2026-04-17 at 20.54.12.jpeg" 
  },
  { 
    id: 2, 
    title: "E-commerce Local", 
    client: "Boutique N'Djamena", 
    type: "Site E-commerce", 
    Icon: ShoppingBag, 
    bgColor: "#7a00ff", 
    description: "Boutique en ligne avec paiement mobile et gestion de stocks",
    stack: "React + PHP + MySQL",
    image: "/assets/img/WhatsApp Image 2026-04-17 at 20.54.11.jpeg" 
  },
  { 
    id: 3, 
    title: "Portfolio Créatif", 
    client: "Freelance", 
    type: "Site Vitrine", 
    Icon: Globe, 
    bgColor: "#fdb901", 
    description: "Site portfolio moderne avec animations et design responsive",
    stack: "HTML + CSS + JavaScript",
    image: "/assets/img/WhatsApp Image 2026-04-17 at 20.54.11 (1).jpeg" 
  },
  { 
    id: 4, 
    title: "Dashboard Admin", 
    client: "Startup Tech", 
    type: "Application SaaS", 
    Icon: Database, 
    bgColor: "#7a00ff", 
    description: "Tableau de bord administratif avec graphiques et analytics",
    stack: "Angular + Laravel + Chart.js",
    image: "/assets/img/WhatsApp Image 2026-04-17 at 20.54.10.jpeg" 
  },
  { 
    id: 5, 
    title: "App de Réservation", 
    client: "Hôtel Sahel", 
    type: "Application Web", 
    Icon: Smartphone, 
    bgColor: "#fdb901", 
    description: "Système de réservation de chambres en temps réel",
    stack: "React + Node.js + MongoDB",
    image: "/assets/img/WhatsApp Image 2026-04-17 at 20.54.10 (1).jpeg" 
  },
  { 
    id: 6, 
    title: "API REST Platform", 
    client: "Tech Company", 
    type: "Backend", 
    Icon: Code, 
    bgColor: "#7a00ff", 
    description: "API RESTful complète avec authentification et documentation",
    stack: "Laravel + JWT + Swagger",
    image: "/assets/img/WhatsApp Image 2026-04-17 at 20.54.09.jpeg" 
  }
];

const filters = ["Tous", "Application Web", "Site E-commerce", "Site Vitrine", "Backend"];

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [hoveredId, setHoveredId] = useState(null);

  const filteredProjects = activeFilter === "Tous"
    ? projects
    : projects.filter(p => p.type === activeFilter);

  return (
    <section id="portfolio" className="bg-primary portfolio-section">
      <div className="portfolio-bg">
        <img src="/assets/portfolio.png" alt="Background" className="portfolio-bg-image" />
      </div>
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-label" style={{ color: '#7a00ff' }}>Réalisations</span>
          <h2 className="section-title">Portfolio <span className="text-orange">Développeur</span></h2>
          <p className="section-description">
            Une sélection de mes projets web et applications. Chaque projet résout un problème réel.
          </p>
        </div>

        {/* Filters */}
        <div className="portfolio-filters">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`portfolio-filter-btn ${activeFilter === filter ? 'active' : ''}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="portfolio-grid">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="portfolio-card"
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Thumbnail */}
              <div className="portfolio-thumbnail">
                <img src={project.image} alt={project.title} className="portfolio-image" />
                
                {/* Overlay */}
                <div className="portfolio-overlay">
                  <div 
                    className="portfolio-play"
                    style={{ opacity: hoveredId === project.id ? 1 : 0, transform: hoveredId === project.id ? 'scale(1)' : 'scale(0.5)' }}
                  >
                    <ExternalLink size={24} fill="white" />
                  </div>
                </div>

                {/* Type Icon */}
                <div className="portfolio-platform" style={{ backgroundColor: project.bgColor }}>
                  <project.Icon size={16} color="white" />
                </div>

                {/* Stack Badge */}
                <div className="portfolio-views">{project.stack}</div>
              </div>

              {/* Content */}
              <div className="portfolio-content">
                <span className="portfolio-type">{project.type}</span>
                <h3 className="portfolio-title">{project.title}</h3>
                <p className="portfolio-artist">{project.client}</p>
                <p className="portfolio-description">{project.description}</p>
                <a href="#" className="portfolio-link">
                  <ExternalLink size={12} />
                  Voir le projet
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
