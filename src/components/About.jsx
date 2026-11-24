import { ArrowRight } from 'lucide-react';
import Eyebrow from './Eyebrow';
import { useSectionNav } from '../hooks/useSectionNav';
import { useI18n } from '../i18n/context';

const stats = [
  { number: "3", key: 'about.years' },
  { number: "15+", key: 'about.projects' },
  { number: "10+", key: 'about.clients' },
];

const partners = [
  { name: "Partenaire WD", logo: "/assets/partenaires/1.png" },
  { name: "Partenaire e.", logo: "/assets/partenaires/2.png" },
  { name: "Success Media TV", logo: "/assets/partenaires/3.png" },
  { name: "GameZone", logo: "/assets/partenaires/4.png" },
  { name: "Cunicole Sahel", logo: "/assets/partenaires/5.png" },
  { name: "mab Grocery Store", logo: "/assets/partenaires/6.png" },
];

export default function About() {
  const goTo = useSectionNav();
  const { t } = useI18n();

  return (
    <section id="about" className="section section-dark">
      <div className="container">
        <div className="about-grid">
          <div className="about-intro">
            <Eyebrow>{t('about.eyebrow')}</Eyebrow>
            <h2 className="section-title">{t('about.title')}</h2>
            <p className="section-text">
              {t('about.before')}<strong>Willy Dev</strong>{t('about.after')}
            </p>
            <a href="#contact" onClick={goTo('contact')} className="link-arrow">
              {t('about.cta')} <ArrowRight size={14} />
            </a>
          </div>

          <div className="about-side">
            <div className="about-stats">
              {stats.map((stat) => (
                <div key={stat.key} className="about-stat">
                  <span className="about-stat-number display">{stat.number}</span>
                  <span className="about-stat-label">{t(stat.key)}</span>
                </div>
              ))}
            </div>
            <p className="section-text">
              {t('about.mission')}
            </p>
          </div>
        </div>

        <div className="about-partners">
          <h3 className="about-partners-title">{t('about.partners')}</h3>
          <ul className="about-partners-list">
            {partners.map((partner) => (
              <li key={partner.name}>
                <img src={partner.logo} alt={partner.name} loading="lazy" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
