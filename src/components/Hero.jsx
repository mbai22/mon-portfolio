import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useSectionNav } from '../hooks/useSectionNav';
import { socialLinks } from '../data/social';
import { useI18n } from '../i18n/context';

export default function Hero() {
  const goTo = useSectionNav();
  const { t } = useI18n();

  return (
    <section id="hero" className="hero">
      <div className="container hero-grid">
        <div className="hero-left">
          <span className="hero-line" aria-hidden="true" />
          <h1 className="hero-title">
            {t('hero.title1')}<br />
            {t('hero.title2')}
          </h1>
          <p className="hero-text">
            {t('hero.text')}
          </p>
          <a href="#about" onClick={goTo('about')} className="hero-scroll" aria-label={t('hero.scroll')}>
            <ArrowDown size={26} />
          </a>
        </div>

        <div className="hero-photo">
          {/* Keep srcSet/sizes in sync with the preload in index.html */}
          <img
            src="/assets/img/willy-hero.webp"
            srcSet="/assets/img/willy-hero-828.webp 828w, /assets/img/willy-hero-1000.webp 1000w, /assets/img/willy-hero.webp 1334w"
            sizes="(max-width: 768px) 67vh, (max-width: 1024px) 400px, 600px"
            alt={t('hero.alt')}
            width="1334"
            height="2000"
            fetchPriority="high"
          />
        </div>

        <aside className="hero-right">
          <div className="hero-block">
            <p className="hero-block-title">{t('hero.aboutTitle')}</p>
            <p>{t('hero.aboutText')}</p>
            <a href="#about" onClick={goTo('about')} className="link-arrow">
              {t('hero.more')} <ArrowRight size={14} />
            </a>
          </div>

          <div className="hero-block">
            <p className="hero-block-title">{t('hero.workTitle')}</p>
            <p>{t('hero.workText')}</p>
            <Link to="/portfolio" className="link-arrow">
              {t('hero.seePortfolio')} <ArrowRight size={14} />
            </Link>
          </div>

          <div className="hero-block hero-follow">
            <p className="hero-block-title">{t('hero.follow')}</p>
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
