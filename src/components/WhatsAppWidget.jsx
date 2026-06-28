import WhatsAppIcon from './WhatsAppIcon';

export default function WhatsAppWidget() {
  return (
    <a
      href="https://wa.me/23563935784?text=Bonjour%20!%20Je%20suis%20int%C3%A9ress%C3%A9%20par%20vos%20services."
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
