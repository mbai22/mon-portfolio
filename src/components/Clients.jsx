import { Building2, Globe, Smartphone, Code, Database, Cloud } from 'lucide-react';

const clients = [
  { name: "TechCorp", icon: Building2, description: "Entreprise technologique" },
  { name: "Global Solutions", icon: Globe, description: "Solutions internationales" },
  { name: "MobileFirst", icon: Smartphone, description: "Applications mobiles" },
  { name: "DevStudio", icon: Code, description: "Studio de développement" },
  { name: "DataFlow", icon: Database, description: "Gestion de données" },
  { name: "CloudSync", icon: Cloud, description: "Services cloud" }
];

export default function Clients() {
  return (
    <section id="clients" className="clients-section">
      <div className="section-container">
        <span className="section-label">CLIENTS & PARTENAIRES</span>
        <h2 className="section-title">Ils me font confiance</h2>
        <p className="section-description">
          J'ai eu le plaisir de collaborer avec des entreprises innovantes et des partenaires de confiance.
        </p>

        <div className="clients-grid">
          {clients.map((client, index) => (
            <div key={index} className="client-card">
              <div className="client-icon">
                <client.icon size={32} />
              </div>
              <h3 className="client-name">{client.name}</h3>
              <p className="client-description">{client.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
