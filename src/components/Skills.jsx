import { Code2, Server, GitBranch, PenTool, Clapperboard, ChevronLeft, ChevronRight } from 'lucide-react';
import Eyebrow from './Eyebrow';
import { useCarousel } from '../hooks/useCarousel';

const skillCategories = [
  {
    name: "Frontend",
    icon: Code2,
    skills: [
      { name: "Angular", level: 90 },
      { name: "React", level: 85 },
      { name: "JavaScript", level: 90 },
      { name: "HTML/CSS", level: 95 }
    ]
  },
  {
    name: "Backend",
    icon: Server,
    skills: [
      { name: "Laravel", level: 85 },
      { name: "PHP", level: 85 },
      { name: "API REST", level: 90 },
      { name: "MySQL", level: 80 }
    ]
  },
  {
    name: "DevOps",
    icon: GitBranch,
    skills: [
      { name: "Git", level: 85 },
      { name: "Docker", level: 70 },
      { name: "CI/CD", level: 75 }
    ]
  },
  {
    name: "Design",
    icon: PenTool,
    skills: [
      { name: "UI/UX Design", level: 85 },
      { name: "Figma", level: 90 },
      { name: "Photoshop", level: 80 },
      { name: "Illustrator", level: 75 }
    ]
  },
  {
    name: "Vidéo",
    icon: Clapperboard,
    skills: [
      { name: "Montage Vidéo", level: 85 },
      { name: "Motion Design", level: 75 },
      { name: "Premiere Pro", level: 85 },
      { name: "After Effects", level: 70 }
    ]
  }
];

export default function Skills() {
  const { scrollRef, scroll } = useCarousel({ cardSelector: '.skill-card' });

  return (
    <section id="skills" className="section section-darker">
      <div className="container">
        <div className="skills-head">
          <div className="skills-head-text">
            <Eyebrow>Compétences</Eyebrow>
            <h2 className="section-title">Une boîte à outils complète</h2>
          </div>
          <div className="skills-arrows">
            <button className="skills-arrow" onClick={() => scroll(-1)} aria-label="Précédent">
              <ChevronLeft size={20} />
            </button>
            <button className="skills-arrow skills-arrow-primary" onClick={() => scroll(1)} aria-label="Suivant">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="skills-track">
          {skillCategories.map((category) => (
            <article key={category.name} className="skill-card">
              <div className="skill-card-head">
                <span className="skill-card-icon">
                  <category.icon size={20} />
                </span>
                <h3 className="skill-card-title display">{category.name}</h3>
              </div>
              <ul className="skill-list">
                {category.skills.map((skill) => (
                  <li key={skill.name} className="skill-item">
                    <div className="skill-info">
                      <span>{skill.name}</span>
                      <span className="skill-level">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-bar-fill" style={{ width: `${skill.level}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
