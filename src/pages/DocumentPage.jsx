import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, Loader2, Printer } from 'lucide-react';
import DocumentView from '../components/DocumentView';
import { docTotals, fcfa } from '../components/docUtils';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { WHATSAPP_NUMBER } from '../data/social';
import { useI18n } from '../i18n/context';

// Private quote / invoice page: /document/<secret token>
export default function DocumentPage() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const token = pathname.split('/')[2] || '';
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/documents.php?token=${encodeURIComponent(token)}`, { cache: 'no-store' })
      .then(async (r) => { const d = await r.json().catch(() => ({})); if (!r.ok) throw new Error(d.error || 'Document introuvable.'); return d; })
      .then((d) => {
        if (cancelled) return;
        setData(d);
        document.title = `${d.doc.type === 'invoice' ? 'Facture' : 'Devis'} ${d.doc.number} | Willy Dev`;
      })
      .catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [token]);

  const accept = async () => {
    if (!window.confirm(t('doc.acceptConfirm'))) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/documents.php?token=${encodeURIComponent(token)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'accept' }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || t('doc.error'));
      setData(d);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (!data) {
    return (
      <main className="doc-page">
        <div className="client-center">{error ? <p className="tool-error">{error}</p> : <Loader2 size={26} className="spin" />}</div>
      </main>
    );
  }

  const { doc, issuer } = data;
  const totals = docTotals(doc);
  const label = doc.type === 'invoice' ? 'la facture' : 'le devis';
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Bonjour Willy, à propos de ${label} ${doc.number} (${fcfa(totals.total)}) : `)}`;

  return (
    <main className="doc-page">
      <div className="doc-toolbar">
        <button type="button" className="btn-pill" onClick={() => window.print()}><Printer size={16} /> {t('doc.pdf')}</button>
        {doc.type === 'quote' && doc.status === 'sent' && (
          <button type="button" className="btn-pill doc-accept" onClick={accept} disabled={busy}><CheckCircle2 size={16} /> {t('doc.accept')}</button>
        )}
        {doc.status === 'accepted' && <span className="doc-accepted"><CheckCircle2 size={16} /> {t('doc.accepted')}</span>}
        <a className="btn-ghost doc-wa" href={wa} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={16} /> {t('doc.question')}</a>
      </div>
      {error && <p className="tool-error doc-error">{error}</p>}
      <DocumentView doc={doc} issuer={issuer} />
      <p className="doc-hint">{t('doc.hint')}</p>
    </main>
  );
}
