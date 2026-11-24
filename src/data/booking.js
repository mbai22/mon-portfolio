// Prise de rendez-vous (page /rendez-vous), modifiable depuis /admin.
// days : jours ouverts (1 = lundi … 7 = dimanche), heures à N'Djamena (UTC+1).
export const booking = {
  intro: "Un appel de 15 minutes, gratuit et sans engagement, pour parler de votre projet. Choisissez un créneau : je vous appelle (ou on échange sur WhatsApp) à l'heure prévue.",
  duration: 15,
  days: [1, 2, 3, 4, 5, 6],
  slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  horizonDays: 14,
  minNoticeHours: 12,
  topics: ['Site internet', 'Application web ou mobile', 'Refonte de site', 'Design graphique', 'Montage vidéo', 'Autre'],
  closedDates: [],
};
