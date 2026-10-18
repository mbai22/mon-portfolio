import { ChevronsRight } from 'lucide-react';

export default function ProjectCard({ project }) {
  return (
    <article className="media-card">
      <div className="media-card-image">
        <img src={project.image} alt={project.title} loading="lazy" />
        <span className="media-card-tag">{project.stack}</span>
      </div>
      <div className="media-card-body">
        <span className="media-card-kicker display">{project.type}</span>
        <h3 className="media-card-title">{project.title}</h3>
        <p className="media-card-text">{project.description}</p>
        <div className="media-card-footer">
          <span className="media-card-meta">{project.client}</span>
          <span className="circle-icon" aria-hidden="true"><ChevronsRight size={16} /></span>
        </div>
      </div>
    </article>
  );
}
