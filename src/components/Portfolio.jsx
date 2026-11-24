import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronsRight } from 'lucide-react';
import Eyebrow from './Eyebrow';
import ProjectCard from './ProjectCard';
import { useProjects } from '../content/useContent';
import { useI18n } from '../i18n/context';

export default function Portfolio() {
  const { projects, filters } = useProjects();
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState("Tous");

  const filteredProjects = activeFilter === "Tous"
    ? projects
    : projects.filter(p => p.type === activeFilter);

  return (
    <section id="portfolio" className="section section-light">
      <div className="container">
        <div className="section-head">
          <Eyebrow>{t('portfolio.eyebrow')}</Eyebrow>
          <h2 className="section-title">{t('portfolio.title')}</h2>
          <div className="pill-tabs">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`pill-tab${activeFilter === filter ? ' active' : ''}`}
              >
                {filter === 'Tous' ? t('portfolio.all') : filter}
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
          <Link to="/portfolio" className="btn-pill">
            {t('portfolio.seeAll')}
            <span className="circle-icon"><ChevronsRight size={16} /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
