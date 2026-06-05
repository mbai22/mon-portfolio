const skillsByCategory = {
  Frontend: [
    { name: "Angular", level: 90 },
    { name: "React", level: 85 },
    { name: "JavaScript", level: 90 },
    { name: "HTML/CSS", level: 95 }
  ],
  Backend: [
    { name: "Laravel", level: 85 },
    { name: "PHP", level: 85 },
    { name: "API REST", level: 90 },
    { name: "MySQL", level: 80 }
  ],
  DevOps: [
    { name: "Git", level: 85 },
    { name: "Docker", level: 70 },
    { name: "CI/CD", level: 75 }
  ]
};

export default function Skills() {
  return (
    <section id="skills" className="bg-primary skills-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-label">Compétences</span>
          <h2 className="section-title">Mes <span className="text-orange">Compétences</span></h2>
          <p className="section-description">
            Expertise technique en développement web full stack.
          </p>
        </div>

        <div className="skills-container">
          {Object.entries(skillsByCategory).map(([category, skills]) => (
            <div key={category} className="skill-category-block">
              <h3 className="skill-category-title">{category}</h3>
              <div className="skills-list">
                {skills.map((skill) => (
                  <div key={skill.name} className="skill-item">
                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-level">{skill.level}%</span>
                    </div>
                    <div className="skill-progress-bar">
                      <div 
                        className="skill-progress-fill" 
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
