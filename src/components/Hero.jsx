import { Download } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-bg" />

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-status-badge">
              <div className="status-dot" />
              <span className="status-text">Disponible pour nouveaux projets</span>
            </div>

            <h1 className="hero-heading">
              <span className="hero-heading-line">Développeur</span>
              <span className="hero-heading-line hero-heading-accent">Full Stack</span>
              <span className="hero-heading-line">Créatif</span>
            </h1>

            <p className="hero-subtitle">
              Spécialisé en Angular, Laravel et React. Je transforme vos idées en applications web performantes et modernes.
            </p>

            <div className="hero-cta-group">
              <a href="#portfolio" className="btn-primary hero-btn-primary">
                Voir mes projets
              </a>
              <a href="#contact" className="btn-secondary hero-btn-secondary">
                Me contacter
              </a>
            </div>

            <div className="hero-secondary-actions">
              <a href="/cv-willy-dev.pdf" download className="hero-link">
                <Download size={16} />
                Télécharger CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
