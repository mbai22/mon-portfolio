import { Github, Linkedin, Mail } from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';

export const WHATSAPP_URL = "https://wa.me/23587268896?text=Bonjour%20!%20Je%20suis%20int%C3%A9ress%C3%A9%20par%20vos%20services.";
export const CONTACT_EMAIL = "contact@willydev.online";

export const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/mbai22" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/mba%C3%AFhornomwillifred/" },
  { icon: WhatsAppIcon, label: "WhatsApp", href: WHATSAPP_URL },
  { icon: Mail, label: "Email", href: `mailto:${CONTACT_EMAIL}` },
];
