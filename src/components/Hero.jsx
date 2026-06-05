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
          <div className="hero-left">
            <h1 className="hero-heading">
              <span className="hero-heading-line">Willy</span>
              <span className="hero-heading-line hero-heading-accent">Dev</span>
            </h1>

            <p className="hero-subtitle">
              Développeur Full Stack — Angular, Laravel, React.
            </p>

            <div className="hero-cta-group">
              <a href="#portfolio" className="btn-primary hero-btn-primary">
                Voir mes projets
              </a>
              <a href="#contact" className="btn-secondary hero-btn-secondary">
                Me contacter
              </a>
            </div>
          </div>

          <div className="hero-right">
            <img 
              src="/assets/logo-hero.png" 
              alt="WillyDev Logo" 
              className="hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
