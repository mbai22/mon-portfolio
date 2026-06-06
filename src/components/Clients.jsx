const clients = [
  { name: "TechCorp", logo: "/assets/partenaires/1.png" },
  { name: "Global", logo: "/assets/partenaires/2.png" },
  { name: "MobileFirst", logo: "/assets/partenaires/3.png" },
  { name: "DevStudio", logo: "/assets/partenaires/4.png" },
  { name: "DataFlow", logo: "/assets/partenaires/5.png" },
  { name: "CloudSync", logo: "/assets/partenaires/6.png" }
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
                <img src={client.logo} alt={client.name} className="client-logo" />
                <span className="client-slide-name">{client.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
