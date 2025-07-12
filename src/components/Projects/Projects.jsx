import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Github, Eye } from 'lucide-react';
import './Projects.css';

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'Tous' },
    { id: 'web', label: 'Web' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'design', label: 'Design' },
    { id: 'fullstack', label: 'Full Stack' }
  ];

  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Plateforme e-commerce complète avec gestion des produits, panier et paiements.',
      image: '/api/placeholder/400/300',
      category: 'fullstack',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: true
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Application de gestion de tâches avec interface moderne et fonctionnalités avancées.',
      image: '/api/placeholder/400/300',
      category: 'web',
      technologies: ['React', 'TypeScript', 'Firebase'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: true
    },
    {
      id: 3,
      title: 'Fitness Tracker Mobile',
      description: 'Application mobile pour suivre les entraînements et la progression fitness.',
      image: '/api/placeholder/400/300',
      category: 'mobile',
      technologies: ['React Native', 'Redux', 'SQLite'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: false
    },
    {
      id: 4,
      title: 'Portfolio Design',
      description: 'Design moderne et responsive pour portfolio de développeur.',
      image: '/api/placeholder/400/300',
      category: 'design',
      technologies: ['Figma', 'HTML/CSS', 'JavaScript'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: false
    },
    {
      id: 5,
      title: 'Weather Dashboard',
      description: 'Tableau de bord météo avec API en temps réel et graphiques interactifs.',
      image: '/api/placeholder/400/300',
      category: 'web',
      technologies: ['Vue.js', 'Chart.js', 'OpenWeather API'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: false
    },
    {
      id: 6,
      title: 'Social Media Dashboard',
      description: 'Dashboard pour gérer les réseaux sociaux avec analytics et planification.',
      image: '/api/placeholder/400/300',
      category: 'fullstack',
      technologies: ['React', 'Express', 'PostgreSQL', 'Redis'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: false
    }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <section id="projects" className="projects" ref={ref}>
      <div className="projects-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2>Mes projets</h2>
          <p>Découvrez mes réalisations récentes</p>
        </motion.div>

        <motion.div
          className="filters"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        <motion.div
          className="projects-grid"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className={`project-card ${project.featured ? 'featured' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="project-image">
                  <div className="image-placeholder">
                    <span>{project.title}</span>
                  </div>
                  {project.featured && (
                    <div className="featured-badge">
                      <span>Projet vedette</span>
                    </div>
                  )}
                  <div className="project-overlay">
                    <div className="project-actions">
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye size={20} />
                        <span>Voir</span>
                      </motion.a>
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Github size={20} />
                        <span>Code</span>
                      </motion.a>
                    </div>
                  </div>
                </div>

                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  
                  <div className="project-technologies">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="project-links">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      <ExternalLink size={16} />
                      Voir le projet
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div
            className="no-projects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p>Aucun projet trouvé pour cette catégorie.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects; 