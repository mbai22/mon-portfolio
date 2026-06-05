import { MapPin, Calendar, Award, Code, User, Zap } from 'lucide-react';

const achievements = [
  { icon: Code, number: "15+", label: "Projets livrés" },
  { icon: Award, number: "10+", label: "Clients satisfaits" },
  { icon: MapPin, number: "Tchad", label: "Base à N'djamena" },
  { icon: Calendar, number: "2 ans", label: "D'expérience" }
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
                Je suis <strong>Willy Dev</strong>, développeur web spécialisé en Angular et Laravel. 
                J&apos;accompagne les entreprises et entrepreneurs à créer des plateformes performantes, rapides et évolutives.
              </p>
              <p>
                Ma mission ? Transformer vos idées en applications web modernes qui génèrent des résultats concrets. 
                Je me concentre sur la qualité du code, l&apos;expérience utilisateur et la performance.
              </p>
              <p>
                Chaque projet est une opportunité de repousser les limites et de créer quelque chose d&apos;exceptionnel.
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
