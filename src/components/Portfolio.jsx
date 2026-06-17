import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { useCarousel } from '../hooks/useCarousel';
import { projects, filters } from '../data/projects';

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [hoveredId, setHoveredId] = useState(null);
  const { scrollRef, activeIndex, scrollTo } = useCarousel({ cardSelector: '.portfolio-card', gap: 16 });

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
        <div ref={scrollRef} className="portfolio-grid">
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

        {/* Navigation Dots */}
        <div className="portfolio-dots">
          {filteredProjects.map((_, index) => (
            <button
              key={index}
              className={`portfolio-dot${index === activeIndex ? ' active' : ''}`}
              onClick={() => scrollTo(index)}
              aria-label={`Projet ${index + 1}`}
            />
          ))}
        </div>

        <div className="text-center" style={{ marginTop: '48px' }}>
          <Link to="/projets" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Voir plus de projets
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
