import { useState } from 'react';
import { Phone } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

const numbers = [
  { label: "Tchad", number: "23563935784" },
  { label: "Cameroun", number: "237695577792" },
];

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="whatsapp-widget-container">
      {open && (
        <div className="whatsapp-menu">
          {numbers.map((item) => (
            <a
              key={item.label}
              href={`https://wa.me/${item.number}?text=Bonjour%20!%20Je%20suis%20int%C3%A9ress%C3%A9%20par%20vos%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-option"
              onClick={() => setOpen(false)}
            >
              <Phone size={14} />
              {item.label}
            </a>
          ))}
        </div>
      )}
      <button
        className="whatsapp-widget"
        onClick={() => setOpen(!open)}
        aria-label="Contacter sur WhatsApp"
      >
        <div className="whatsapp-icon">
          <WhatsAppIcon size={28} />
        </div>
        <span className="whatsapp-tooltip">Discuter sur WhatsApp</span>
      </button>
    </div>
  );
}
