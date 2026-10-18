import WhatsAppIcon from './WhatsAppIcon';
import { WHATSAPP_URL } from '../data/social';

export default function WhatsAppWidget() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-widget"
      aria-label="Contacter sur WhatsApp"
    >
      <div className="whatsapp-icon">
        <WhatsAppIcon size={28} />
      </div>
    </a>
  );
}
