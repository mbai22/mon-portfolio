import { MapPin, Calendar, Award, Code, Palette, Camera, Zap } from 'lucide-react';

const achievements = [
  { icon: Code, number: "15+", label: "Projets web" },
  { icon: Palette, number: "20+", label: "Designs réalisés" },
  { icon: Camera, number: "50+", label: "Vidéos produites" },
  { icon: Award, number: "10+", label: "Clients satisfaits" },
  { icon: MapPin, number: "Tchad", label: "Base à N'djamena" },
  { icon: Calendar, number: "3 ans", label: "D'expérience" }
];

export default function About() {
  return (
    <section id="about" className="bg-primary">
      <div className="section-container">
        <div className="about-grid">
          {/* Image Side */}
          <div className="about-image-wrapper animate-slideInLeft">
            <div className="about-image">
              <img 
                src="/assets/img/about_willy.jpeg" 
                alt="Willy Dev - Développeur Web"
                className="about-image-img"
                loading="lazy"
              />
              <div className="about-image-overlay" />
              
              {/* Floating Badge */}
              <div className="about-badge animate-fadeIn delay-300">
                <div className="about-badge-icon">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="about-badge-title">Disponible maintenant</p>
                  <p className="about-badge-text">Prêt pour vos projets</p>
                </div>
              </div>
            </div>


          </div>

          {/* Content Side */}
          <div className="about-content animate-slideInRight">
            <span className="section-label">À Propos</span>
            <h2 className="section-title" style={{ textAlign: 'left' }}>
              Des solutions web qui <span className="text-orange">transforment</span>
            </h2>
            
            <div>
              <p>
                Je suis <strong>Willy Dev</strong>, développeur web, designer UI/UX et vidéaste basé au Tchad.
                Je crée des applications performantes, des designs élégants et des vidéos engageantes pour les marques et entrepreneurs.
              </p>
              <p>
                Ma mission ? Transformer vos idées en solutions concrètes — que ce soit une plateforme web, une identité visuelle ou un contenu vidéo professionnel.
                Je mise sur la qualité, la créativité et l'impact.
              </p>
              <p>
                Chaque projet est une opportunité de repousser les limites et de créer quelque chose d'exceptionnel.
              </p>
            </div>

            {/* Achievement Grid */}
            <div className="about-stats">
              {achievements.map((item, index) => (
                <div key={item.label} className="about-stat" style={{ animationDelay: `${index * 100}ms` }}>
                  <item.icon className="about-stat-icon" />
                  <div className="about-stat-number">{item.number}</div>
                  <div className="about-stat-label">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
