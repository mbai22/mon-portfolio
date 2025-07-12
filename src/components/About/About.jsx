import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, MapPin, GraduationCap, Briefcase } from 'lucide-react';
import './About.css';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    { number: '3+', label: 'Années d\'expérience' },
    { number: '50+', label: 'Projets réalisés' },
    { number: '20+', label: 'Clients satisfaits' },
    { number: '100%', label: 'Taux de réussite' }
  ];

  const experiences = [
    {
      title: 'Développeur Full Stack Senior',
      company: 'Entreprise Tech',
      period: '2022 - Présent',
      description: 'Développement d\'applications web complexes avec React, Node.js et bases de données.'
    },
    {
      title: 'Développeur Frontend',
      company: 'Startup Innovation',
      period: '2020 - 2022',
      description: 'Création d\'interfaces utilisateur modernes et responsives avec React et TypeScript.'
    },
    {
      title: 'Développeur Junior',
      company: 'Agence Web',
      period: '2019 - 2020',
      description: 'Développement de sites web et d\'applications avec HTML, CSS, JavaScript.'
    }
  ];

  return (
    <section id="about" className="about" ref={ref}>
      <div className="about-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2>À propos de moi</h2>
          <p>Découvrez mon parcours et mon expertise</p>
        </motion.div>

        <div className="about-content">
          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3>Qui suis-je ?</h3>
            <p>
              Je suis un développeur web passionné avec plus de 3 ans d'expérience dans la création 
              d'applications web modernes et performantes. Mon expertise couvre l'ensemble de la 
              stack technologique, du frontend au backend.
            </p>
            <p>
              J'aime résoudre des problèmes complexes et créer des expériences utilisateur 
              exceptionnelles. Je suis constamment en train d'apprendre de nouvelles technologies 
              pour rester à la pointe de l'innovation.
            </p>

            <div className="personal-info">
              <div className="info-item">
                <Calendar size={20} />
                <span>Né en 1995</span>
              </div>
              <div className="info-item">
                <MapPin size={20} />
                <span>Paris, France</span>
              </div>
              <div className="info-item">
                <GraduationCap size={20} />
                <span>Master en Informatique</span>
              </div>
              <div className="info-item">
                <Briefcase size={20} />
                <span>Disponible pour freelance</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="about-stats"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="stat-item"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <h3>{stat.number}</h3>
                  <p>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="experience-section"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3>Mon expérience professionnelle</h3>
          <div className="timeline">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                className="timeline-item"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
              >
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h4>{exp.title}</h4>
                    <span className="company">{exp.company}</span>
                  </div>
                  <span className="period">{exp.period}</span>
                  <p>{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About; 