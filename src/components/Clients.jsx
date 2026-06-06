const clients = [
  { name: "TechCorp", initial: "TC", color: "#7D53FF" },
  { name: "Global", initial: "GS", color: "#fdb901" },
  { name: "MobileFirst", initial: "MF", color: "#22c55e" },
  { name: "DevStudio", initial: "DS", color: "#ef4444" },
  { name: "DataFlow", initial: "DF", color: "#3b82f6" },
  { name: "CloudSync", initial: "CS", color: "#ec4899" }
];

function LogoPlaceholder({ initial, color }) {
  return (
    <svg viewBox="0 0 120 40" width="120" height="40" fill="none">
      <rect width="120" height="40" rx="8" fill={color} fillOpacity="0.1" />
      <text x="60" y="26" textAnchor="middle" fill={color} fontSize="16" fontWeight="700" fontFamily="system-ui, sans-serif">
        {initial}
      </text>
    </svg>
  );
}

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
                <LogoPlaceholder initial={client.initial} color={client.color} />
                <span className="client-slide-name">{client.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
