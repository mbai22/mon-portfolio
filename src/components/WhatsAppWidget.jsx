import { MessageCircle } from 'lucide-react';

export default function WhatsAppWidget() {
  const whatsappNumber = '+235123456789'; // Remplacez par votre numéro WhatsApp
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Bonjour%20!%20Je%20suis%20intéressé%20par%20vos%20services.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-widget"
      aria-label="Contacter sur WhatsApp"
    >
      <div className="whatsapp-icon">
        <MessageCircle size={28} />
      </div>
      <span className="whatsapp-tooltip">Discuter sur WhatsApp</span>
    </a>
  );
}
