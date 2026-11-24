// Shared helpers for quotes and invoices (FCFA, no decimals)
const nf = new Intl.NumberFormat('fr-FR');
export const fcfa = (n) => `${nf.format(Math.round(n || 0))} FCFA`;
export const DOC_STATUS = {
  draft: 'Brouillon', sent: 'Envoyé', accepted: 'Accepté', refused: 'Refusé', paid: 'Payé', cancelled: 'Annulé',
};

export function docTotals(doc) {
  const subtotal = (doc.lines || []).reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.price) || 0), 0);
  const afterDiscount = Math.max(0, subtotal - (Number(doc.discount) || 0));
  const tax = Math.round(afterDiscount * ((Number(doc.taxRate) || 0) / 100));
  const total = afterDiscount + tax;
  const deposit = Math.round(total * ((Number(doc.deposit) || 0) / 100));
  const remaining = Math.max(0, total - (Number(doc.paid) || 0));
  return { subtotal, afterDiscount, tax, total, deposit, remaining };
}

