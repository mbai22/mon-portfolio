import { ArrowRight } from 'lucide-react';
import Eyebrow from './Eyebrow';
import { useSectionNav } from '../hooks/useSectionNav';

const stats = [
  { number: "3", label: "Années d'expérience" },
  { number: "15+", label: "Projets web livrés" },
  { number: "10+", label: "Clients satisfaits" },
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

  return (
    <section id="about" className="section section-dark">
      <div className="container">
        <div className="about-grid">
          <div className="about-intro">
            <Eyebrow>À propos</Eyebrow>
            <h2 className="section-title">Des solutions digitales qui font la différence</h2>
            <p className="section-text">
              Je suis <strong>Willy Dev</strong>, développeur web, designer UI/UX et vidéaste basé au Tchad.
              Je crée des applications performantes, des designs élégants et des vidéos engageantes pour les marques et les entrepreneurs.
            </p>
            <a href="#contact" onClick={goTo('contact')} className="link-arrow">
              Discutons de votre projet <ArrowRight size={14} />
            </a>
          </div>

          <div className="about-side">
            <div className="about-stats">
              {stats.map((stat) => (
                <div key={stat.label} className="about-stat">
                  <span className="about-stat-number display">{stat.number}</span>
                  <span className="about-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
            <p className="section-text">
              Ma mission : transformer vos idées en solutions concrètes, que ce soit une plateforme web, une identité visuelle ou un contenu vidéo professionnel.
              Je mise sur la qualité, la créativité et l'impact.
            </p>
          </div>
        </div>

        <div className="about-partners">
          <h3 className="about-partners-title">Ils m'ont fait confiance</h3>
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
