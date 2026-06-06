import { Building2, Globe, Smartphone, Code, Database, Cloud } from 'lucide-react';

const clients = [
  { name: "TechCorp", icon: Building2 },
  { name: "Global Solutions", icon: Globe },
  { name: "MobileFirst", icon: Smartphone },
  { name: "DevStudio", icon: Code },
  { name: "DataFlow", icon: Database },
  { name: "CloudSync", icon: Cloud }
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

        <div className="clients-slider">
          <div className="clients-track">
            {[...clients, ...clients].map((client, index) => (
              <div key={index} className="client-slide">
                <div className="client-slide-icon">
                  <client.icon size={28} />
                </div>
                <span className="client-slide-name">{client.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
