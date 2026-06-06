import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { projects, filters } from '../data/projects';

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("Tous");

  const filteredProjects = activeFilter === "Tous"
    ? projects
    : projects.filter(p => p.type === activeFilter);

  return (
    <div className="projects-page">
      <div className="projects-page-header">
        <div className="section-container">
          <span className="section-label" style={{ color: '#7a00ff' }}>Réalisations</span>
          <h1 className="section-title">Tous mes <span className="text-orange">projets</span></h1>
          <p className="section-description">
            Découvrez l'ensemble de mes projets web et applications.
          </p>
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
        </div>
      </div>

      <div className="section-container">
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="portfolio-thumbnail">
                <img src={project.image} alt={project.title} className="portfolio-image" />
                <div className="portfolio-overlay">
                  <div className="portfolio-play">
                    <ExternalLink size={24} fill="white" />
                  </div>
                </div>
                <div className="portfolio-platform" style={{ backgroundColor: project.bgColor }}>
                  <project.Icon size={16} color="white" />
                </div>
                <div className="portfolio-views">{project.stack}</div>
              </div>
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
    </div>
  );
}