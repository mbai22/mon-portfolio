import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Code, 
  Database, 
  Smartphone, 
  Globe, 
  Palette, 
  Server,
  Users,
  Lightbulb,
  Target,
  MessageSquare
} from 'lucide-react';
import './Skills.css';

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const technicalSkills = [
    {
      category: 'Frontend',
      icon: Code,
      skills: [
        { name: 'React', level: 90 },
        { name: 'JavaScript', level: 85 },
        { name: 'TypeScript', level: 80 },
        { name: 'HTML/CSS', level: 95 },
        { name: 'Vue.js', level: 75 }
      ]
    },
    {
      category: 'Backend',
      icon: Server,
      skills: [
        { name: 'Node.js', level: 85 },
        { name: 'Python', level: 80 },
        { name: 'PHP', level: 75 },
        { name: 'Java', level: 70 },
        { name: 'C#', level: 65 }
      ]
    },
    {
      category: 'Base de données',
      icon: Database,
      skills: [
        { name: 'MySQL', level: 85 },
        { name: 'MongoDB', level: 80 },
        { name: 'PostgreSQL', level: 75 },
        { name: 'Redis', level: 70 },
        { name: 'Firebase', level: 80 }
      ]
    },
    {
      category: 'Mobile',
      icon: Smartphone,
      skills: [
        { name: 'React Native', level: 75 },
        { name: 'Flutter', level: 70 },
        { name: 'Ionic', level: 65 },
        { name: 'Swift', level: 60 },
        { name: 'Kotlin', level: 55 }
      ]
    },
    {
      category: 'DevOps',
      icon: Globe,
      skills: [
        { name: 'Docker', level: 80 },
        { name: 'AWS', level: 75 },
        { name: 'Git', level: 90 },
        { name: 'CI/CD', level: 70 },
        { name: 'Linux', level: 75 }
      ]
    },
    {
      category: 'Design',
      icon: Palette,
      skills: [
        { name: 'Figma', level: 80 },
        { name: 'Adobe XD', level: 75 },
        { name: 'Photoshop', level: 70 },
        { name: 'Illustrator', level: 65 },
        { name: 'Sketch', level: 60 }
      ]
    }
  ];

  const softSkills = [
    {
      icon: Users,
      title: 'Travail d\'équipe',
      description: 'Collaboration efficace dans des équipes multidisciplinaires'
    },
    {
      icon: Lightbulb,
      title: 'Résolution de problèmes',
      description: 'Analyse et résolution de problèmes complexes'
    },
    {
      icon: Target,
      title: 'Gestion de projet',
      description: 'Planification et suivi de projets de développement'
    },
    {
      icon: MessageSquare,
      title: 'Communication',
      description: 'Communication claire avec clients et équipes'
    }
  ];

  return (
    <section id="skills" className="skills" ref={ref}>
      <div className="skills-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2>Mes compétences</h2>
          <p>Technologies et outils que je maîtrise</p>
        </motion.div>

        <div className="skills-content">
          <motion.div
            className="technical-skills"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3>Compétences techniques</h3>
            <div className="skills-grid">
              {technicalSkills.map((category, categoryIndex) => (
                <motion.div
                  key={category.category}
                  className="skill-category"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + categoryIndex * 0.1 }}
                >
                  <div className="category-header">
                    <category.icon size={24} />
                    <h4>{category.category}</h4>
                  </div>
                  <div className="skills-list">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        className="skill-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.6 + categoryIndex * 0.1 + skillIndex * 0.05 }}
                      >
                        <div className="skill-info">
                          <span className="skill-name">{skill.name}</span>
                          <span className="skill-level">{skill.level}%</span>
                        </div>
                        <div className="skill-bar">
                          <motion.div
                            className="skill-progress"
                            initial={{ width: 0 }}
                            animate={isInView ? { width: `${skill.level}%` } : {}}
                            transition={{ duration: 1, delay: 0.8 + categoryIndex * 0.1 + skillIndex * 0.05 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="soft-skills"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3>Soft Skills</h3>
            <div className="soft-skills-grid">
              {softSkills.map((skill, index) => (
                <motion.div
                  key={skill.title}
                  className="soft-skill-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="soft-skill-icon">
                    <skill.icon size={32} />
                  </div>
                  <h4>{skill.title}</h4>
                  <p>{skill.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills; 