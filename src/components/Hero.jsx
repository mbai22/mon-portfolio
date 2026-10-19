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
          <h1 className="hero-title">
            Je suis Willy,<br />
            Développeur Web & Mobile
          </h1>
          <p className="hero-text">
            Développement d'applications web et mobiles, design graphique et montage vidéo à N'Djamena : je donne vie à vos idées.
          </p>
          <a href="#about" onClick={goTo('about')} className="hero-scroll" aria-label="Défiler vers la section À propos">
            <ArrowDown size={26} />
          </a>
        </div>

        <div className="hero-photo">
          <img src="/assets/img/willy-hero.webp" alt="Willy, développeur web et mobile, graphiste et monteur vidéo à N'Djamena" width="1334" height="2000" fetchPriority="high" />
        </div>

        <aside className="hero-right">
          <div className="hero-block">
            <p className="hero-block-title">À propos</p>
            <p>Développeur full stack, designer UI/UX et vidéaste basé à N'Djamena, au Tchad.</p>
            <a href="#about" onClick={goTo('about')} className="link-arrow">
              En savoir plus <ArrowRight size={14} />
            </a>
          </div>

          <div className="hero-block">
            <p className="hero-block-title">Mon travail</p>
            <p>Sites internet, applications web et mobiles, design graphique et montage vidéo.</p>
            <a href="#portfolio" onClick={goTo('portfolio')} className="link-arrow">
              Voir le portfolio <ArrowRight size={14} />
            </a>
          </div>

          <div className="hero-block hero-follow">
            <p className="hero-block-title">Suivez-moi</p>
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
