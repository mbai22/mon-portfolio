import { useEffect, useState } from 'react';
import Eyebrow from '../components/Eyebrow';
import ProjectCard from '../components/ProjectCard';
import { projects, filters } from '../data/projects';

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("Tous");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProjects = activeFilter === "Tous"
    ? projects
    : projects.filter(p => p.type === activeFilter);

  return (
    <main>
      <header className="projects-page-header section-darker">
        <div className="container section-head">
          <Eyebrow>Réalisations</Eyebrow>
          <h1 className="section-title">Tous mes projets</h1>
          <p className="section-text">Découvrez l'ensemble de mes projets web et applications.</p>
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
      </header>

      <section className="section section-cream">
        <div className="container cards-grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}
