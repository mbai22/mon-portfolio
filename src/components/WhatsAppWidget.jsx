import WhatsAppIcon from './WhatsAppIcon';
import { WHATSAPP_URL } from '../data/social';
import { useI18n } from '../i18n/context';

export default function WhatsAppWidget() {
  const { t } = useI18n();
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-widget"
      aria-label={t('whatsapp')}
    >
      <div className="whatsapp-icon">
        <WhatsAppIcon size={28} />
      </div>
    </a>
  );
}
