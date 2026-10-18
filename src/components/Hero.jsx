import { ArrowDown, ArrowRight } from 'lucide-react';
import { useSectionNav } from '../hooks/useSectionNav';
import { socialLinks } from '../data/social';

export default function Hero() {
  const goTo = useSectionNav();

  return (
    <section id="hero" className="hero">
      <div className="container hero-grid">
        <div className="hero-left">
          <span className="hero-line" aria-hidden="true" />
          <h1 className="hero-title display">
            Je suis Willy,<br />
            <span className="text-lime">Développeur web</span><br />
            & designer
          </h1>
          <p className="hero-text">
            Je conçois des applications web performantes, des designs UI/UX soignés et des contenus vidéo percutants pour donner vie à vos idées.
          </p>
          <a href="#about" onClick={goTo('about')} className="hero-scroll" aria-label="Défiler vers la section À propos">
            <ArrowDown size={26} />
          </a>
        </div>

        <div className="hero-photo">
          <div className="hero-photo-frame">
            <img src="/assets/img/about_willy.jpeg" alt="Willy, développeur web basé à N'Djamena" />
          </div>
          <div className="hero-badge">
            <span className="hero-badge-dot" aria-hidden="true" />
            Disponible pour missions
          </div>
        </div>

        <aside className="hero-right">
          <div className="hero-block">
            <h2 className="hero-block-title">À propos</h2>
            <p>Développeur full stack, designer UI/UX et vidéaste basé à N'Djamena, au Tchad.</p>
            <a href="#about" onClick={goTo('about')} className="link-arrow">
              En savoir plus <ArrowRight size={14} />
            </a>
          </div>

          <div className="hero-block">
            <h2 className="hero-block-title">Mon travail</h2>
            <p>Sites vitrines, e-commerce et applications web avec Angular, Laravel et React.</p>
            <a href="#portfolio" onClick={goTo('portfolio')} className="link-arrow">
              Voir le portfolio <ArrowRight size={14} />
            </a>
          </div>

          <div className="hero-block hero-follow">
            <h2 className="hero-block-title">Suivez-moi</h2>
            <div className="social-row">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="social-link"
                  aria-label={social.label}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
