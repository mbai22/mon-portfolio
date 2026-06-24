import { Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function scrollToSection(id) {
  setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50);
}

export default function Hero() {
  const navigate = useNavigate();

  const handleClick = (sectionId) => (e) => {
    e.preventDefault();
    navigate('/');
    scrollToSection(sectionId);
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-bg" />

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-left">
            <h1 className="hero-heading">
              <span className="hero-heading-line">Développeur</span>
              <span className="hero-heading-line hero-heading-accent">Web & Mobile</span>
              <span className="hero-heading-line">Designer & Vidéaste</span>
            </h1>

            <p className="hero-subtitle">
              Je conçois des applications web performantes, des designs UI/UX soignés et des contenus vidéo percutants pour donner vie à vos idées.
            </p>

            <div className="hero-cta-group">
              <a href="#portfolio" onClick={handleClick('portfolio')} className="btn-primary hero-btn-primary">
                Voir mes projets
              </a>
              <a href="#contact" onClick={handleClick('contact')} className="btn-secondary hero-btn-secondary">
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
