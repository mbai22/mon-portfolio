// A4 quote / invoice, used by the admin preview and the client page (/document/<token>).
// "Télécharger en PDF" prints only this sheet (see .doc-sheet print rules in tools.css).

import { DOC_STATUS, docTotals, fcfa } from './docUtils';
const day = (d) => (d ? new Date(`${d}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '');

export default function DocumentView({ doc, issuer = {} }) {
  const isInvoice = doc.type === 'invoice';
  const t = docTotals(doc);

  return (
    <article className="doc-sheet">
      <header className="doc-head">
        <div>
          <img src="/assets/logo-hero.png" alt={issuer.name || 'Willy Dev'} className="doc-logo" />
          <p className="doc-issuer-name">{issuer.name || 'Willy Dev'}</p>
          {issuer.activity && <p>{issuer.activity}</p>}
          {issuer.address && <p>{issuer.address}</p>}
          {issuer.phone && <p>Tél. {issuer.phone}</p>}
          {issuer.email && <p>{issuer.email}</p>}
          {issuer.website && <p>{issuer.website}</p>}
          {(issuer.nif || issuer.rccm) && <p className="doc-legal">{[issuer.nif && `NIF : ${issuer.nif}`, issuer.rccm && `RCCM : ${issuer.rccm}`].filter(Boolean).join(' · ')}</p>}
        </div>
        <div className="doc-meta">
          <p className="doc-type">{isInvoice ? 'Facture' : 'Devis'}</p>
          <p className="doc-number">N° {doc.number || '—'}</p>
          <p>Date : {day(doc.date)}</p>
          {doc.dueDate && <p>{isInvoice ? 'Échéance' : 'Valable jusqu’au'} : {day(doc.dueDate)}</p>}
          {doc.status && doc.status !== 'draft' && <p className={`doc-status ${doc.status}`}>{DOC_STATUS[doc.status]}</p>}
        </div>
      </header>

      <section className="doc-client">
        <p className="doc-label">{isInvoice ? 'Facturé à' : 'Destinataire'}</p>
        <p className="doc-client-name">{doc.client?.name || '—'}</p>
        {doc.client?.address && <p>{doc.client.address}</p>}
        {doc.client?.phone && <p>{doc.client.phone}</p>}
        {doc.client?.email && <p>{doc.client.email}</p>}
      </section>

      {doc.title && <h2 className="doc-title">{doc.title}</h2>}

      <table className="doc-lines">
        <thead>
          <tr><th>Désignation</th><th className="num">Qté</th><th className="num">Prix unitaire</th><th className="num">Montant</th></tr>
        </thead>
        <tbody>
          {(doc.lines || []).map((l, i) => (
            <tr key={i}>
              <td>{l.label}</td>
              <td className="num">{l.qty}</td>
              <td className="num">{fcfa(l.price)}</td>
              <td className="num">{fcfa((Number(l.qty) || 0) * (Number(l.price) || 0))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="doc-totals">
        <p><span>Sous-total</span><span>{fcfa(t.subtotal)}</span></p>
        {doc.discount > 0 && <p><span>Remise</span><span>− {fcfa(doc.discount)}</span></p>}
        {doc.taxRate > 0 && <p><span>TVA ({doc.taxRate} %)</span><span>{fcfa(t.tax)}</span></p>}
        <p className="doc-grand"><span>Total{doc.taxRate > 0 ? ' TTC' : ''}</span><span>{fcfa(t.total)}</span></p>
        {doc.deposit > 0 && <p><span>Acompte à la commande ({doc.deposit} %)</span><span>{fcfa(t.deposit)}</span></p>}
        {isInvoice && doc.paid > 0 && <p><span>Déjà réglé</span><span>− {fcfa(doc.paid)}</span></p>}
        {isInvoice && <p className="doc-grand"><span>Reste à payer</span><span>{fcfa(t.remaining)}</span></p>}
      </div>

      {doc.notes && <section className="doc-notes"><p className="doc-label">Conditions</p><p>{doc.notes}</p></section>}
      {issuer.payment && <section className="doc-notes"><p className="doc-label">Modalités de paiement</p><p>{issuer.payment}</p></section>}
      {!isInvoice && <p className="doc-sign">Bon pour accord (date et signature du client) :</p>}
      {issuer.footer && <footer className="doc-footer">{issuer.footer}</footer>}
    </article>
  );
}
