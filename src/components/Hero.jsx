import { ArrowRight, ChevronDown, Code, Briefcase, Download, Circle, Mail, Github, Linkedin, ExternalLink } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-bg">
        <div className="hero-gradient-1" />
        <div className="hero-gradient-2" />
        <div className="hero-grid-pattern" />
      </div>

      <div className="hero-container">
        <div className="hero-content">
          {/* Left Side - Content */}
          <div className="hero-left">
            {/* Status Badge */}
            <div className="hero-status-badge">
              <div className="status-dot" />
              <span className="status-text">Disponible pour nouveaux projets</span>
            </div>

            {/* Main Heading */}
            <h1 className="hero-heading">
              <span className="hero-heading-line">Développeur</span>
              <span className="hero-heading-line hero-heading-accent">Full Stack</span>
              <span className="hero-heading-line">Créatif</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle">
              Spécialisé en Angular, Laravel et React. Je transforme vos idées en applications web performantes et modernes.
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta-group">
              <a href="#portfolio" className="btn-primary hero-btn-primary">
                <Code size={20} />
                Voir mes projets
                <ArrowRight size={18} />
              </a>
              <a href="#contact" className="btn-secondary hero-btn-secondary">
                <Mail size={20} />
                Me contacter
              </a>
            </div>

            {/* Secondary Actions */}
            <div className="hero-secondary-actions">
              <a href="/cv-willy-dev.pdf" download className="hero-link">
                <Download size={16} />
                Télécharger CV
              </a>
              <div className="hero-social-links">
                <a href="#" className="hero-social-link" aria-label="GitHub">
                  <Github size={20} />
                </a>
                <a href="#" className="hero-social-link" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Visual Element */}
          <div className="hero-right">
            <img 
              src="/assets/hero-bg.png" 
              alt="Hero" 
              className="hero-image"
            />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel" />
          </div>
          <span className="scroll-text">Scroll</span>
        </div>
      </div>
    </section>
  );
}
