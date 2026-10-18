import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronsRight } from 'lucide-react';
import Eyebrow from './Eyebrow';
import ProjectCard from './ProjectCard';
import { projects, filters } from '../data/projects';

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("Tous");

  const filteredProjects = activeFilter === "Tous"
    ? projects
    : projects.filter(p => p.type === activeFilter);

  return (
    <section id="portfolio" className="section section-light">
      <div className="container">
        <div className="section-head">
          <Eyebrow>Réalisations</Eyebrow>
          <h2 className="section-title">Des projets qui répondent à de vrais besoins</h2>
          <div className="pill-tabs">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`pill-tab${activeFilter === filter ? ' active' : ''}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="cards-grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="cards-cta">
          <Link to="/projets" className="btn-pill">
            Voir tous les projets
            <span className="circle-icon"><ChevronsRight size={16} /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
