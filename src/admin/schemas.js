// What each admin page edits. Field types are rendered by fields.jsx.

export const slugify = (text) =>
  String(text || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 80);

// Blog body <-> plain text: blank line = new paragraph, "## " = subheading, "- " = bullet
export function bodyToText(body = []) {
  return body.map((block) => {
    if (typeof block === 'string') return block;
    if (block?.h2) return `## ${block.h2}`;
    if (Array.isArray(block?.list)) return block.list.map((item) => `- ${item}`).join('\n');
    return '';
  }).filter(Boolean).join('\n\n');
}

export function textToBody(text = '') {
  const blocks = [];
  for (const chunk of text.replace(/\r\n/g, '\n').split(/\n\s*\n/)) {
    const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean);
    let paragraph = [];
    let list = null;
    const flush = () => {
      if (paragraph.length) blocks.push(paragraph.join(' '));
      if (list) blocks.push({ list });
      paragraph = [];
      list = null;
    };
    for (const line of lines) {
      if (line.startsWith('## ')) {
        flush();
        blocks.push({ h2: line.slice(3).trim() });
      } else if (/^[-•*] /.test(line)) {
        if (paragraph.length) { blocks.push(paragraph.join(' ')); paragraph = []; }
        (list ??= []).push(line.slice(2).trim());
      } else {
        if (list) { blocks.push({ list }); list = null; }
        paragraph.push(line);
      }
    }
    flush();
  }
  return blocks;
}

// Accepts a full YouTube link or a bare id
export function youtubeId(value = '') {
  const v = String(value).trim();
  const m = v.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : v;
}

export const schemas = {
  projects: {
    title: 'Projets web',
    description: 'Réalisations de développement affichées sur l’accueil et dans la page Portfolio. Les filtres sont créés à partir du champ « Type ».',
    itemLabel: 'projet',
    display: (item) => ({ title: item.title, subtitle: [item.type, item.client].filter(Boolean).join(' · '), image: item.image }),
    create: () => ({ id: Date.now(), title: '', client: '', type: 'Application Web', description: '', stack: '', image: '' }),
    fields: [
      { name: 'title', label: 'Titre', type: 'text', required: true },
      { name: 'type', label: 'Type (sert de filtre)', type: 'text', required: true, suggestions: 'projectTypes', help: 'Ex. : Application Web, Site E-commerce, Site Vitrine, Backend' },
      { name: 'client', label: 'Client', type: 'text' },
      { name: 'stack', label: 'Technologies', type: 'text', help: 'Affiché en étiquette sur l’image, ex. : React + PHP + MySQL' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
      { name: 'image', label: 'Image', type: 'image', required: true },
    ],
  },

  designWorks: {
    title: 'Design graphique',
    description: 'Logos, affiches, visuels réseaux sociaux… affichés dans la page Portfolio.',
    itemLabel: 'réalisation',
    display: (item) => ({ title: item.title, subtitle: [item.category, item.client].filter(Boolean).join(' · '), image: item.image }),
    create: () => ({ id: `design-${Date.now()}`, title: '', client: '', category: '', image: '' }),
    fields: [
      { name: 'title', label: 'Titre', type: 'text', required: true },
      { name: 'client', label: 'Client', type: 'text' },
      { name: 'category', label: 'Catégorie', type: 'select', options: 'designCategories', required: true },
      { name: 'image', label: 'Image', type: 'image', required: true },
    ],
  },

  videoWorks: {
    title: 'Montage vidéo',
    description: 'Vidéos YouTube ou fichiers MP4 affichés dans la page Portfolio.',
    itemLabel: 'vidéo',
    display: (item) => ({
      title: item.title,
      subtitle: [item.category, item.client].filter(Boolean).join(' · '),
      image: item.poster || (item.youtubeId ? `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg` : ''),
    }),
    create: () => ({ id: `video-${Date.now()}`, title: '', client: '', category: '', youtubeId: '' }),
    fields: [
      { name: 'title', label: 'Titre', type: 'text', required: true },
      { name: 'client', label: 'Client', type: 'text' },
      { name: 'category', label: 'Catégorie', type: 'select', options: 'videoCategories', required: true },
      { name: 'youtubeId', label: 'Lien YouTube', type: 'youtube', help: 'Collez le lien de la vidéo (youtube.com/watch?v=… ou youtu.be/…). Sinon, laissez vide et renseignez un fichier MP4.' },
      { name: 'src', label: 'Fichier MP4 (lien)', type: 'text', help: 'Optionnel : /assets/portfolio/video/ma-video.mp4' },
      { name: 'poster', label: 'Image de couverture (pour un MP4)', type: 'image' },
    ],
  },

  posts: {
    title: 'Blog',
    description: 'Articles du blog. Les 6 plus récents apparaissent sur l’accueil ; chaque article a sa page /blog/…',
    itemLabel: 'article',
    display: (item) => ({
      title: item.title,
      subtitle: [item.category, item.date].filter(Boolean).join(' · '),
      image: item.image || (item.photo ? `https://images.unsplash.com/photo-${item.photo}?w=160&h=100&fit=crop&q=60` : ''),
    }),
    create: () => ({
      slug: '', title: '', description: '', category: '', date: new Date().toISOString().slice(0, 10),
      readTime: '5 min', image: '', imageAlt: '', body: [],
    }),
    fields: [
      { name: 'title', label: 'Titre', type: 'text', required: true },
      { name: 'slug', label: 'Adresse de la page', type: 'slug', from: 'title', prefix: '/blog/', help: 'Laissez vide pour la créer à partir du titre.' },
      { name: 'description', label: 'Résumé (Google et réseaux sociaux)', type: 'textarea', rows: 2, max: 170 },
      { name: 'category', label: 'Catégorie', type: 'text', suggestions: 'postCategories' },
      { name: 'date', label: 'Date de publication', type: 'date', required: true },
      { name: 'readTime', label: 'Temps de lecture', type: 'text', help: 'Ex. : 6 min' },
      { name: 'image', label: 'Image de couverture', type: 'image', help: 'Au moins 1200 px de large de préférence.' },
      { name: 'imageAlt', label: 'Description de l’image (accessibilité)', type: 'text' },
      { name: 'body', label: 'Texte de l’article', type: 'body', required: true },
    ],
  },

  testimonials: {
    title: 'Témoignages',
    description: 'Avis clients affichés sur l’accueil.',
    itemLabel: 'témoignage',
    display: (item) => ({ title: item.name, subtitle: item.role, image: item.image, round: true }),
    create: () => ({ name: '', role: '', content: '', rating: 5, image: '' }),
    fields: [
      { name: 'name', label: 'Nom', type: 'text', required: true },
      { name: 'role', label: 'Fonction / entreprise', type: 'text' },
      { name: 'content', label: 'Témoignage', type: 'textarea', rows: 5, required: true },
      { name: 'rating', label: 'Note', type: 'rating' },
      { name: 'image', label: 'Photo', type: 'image' },
    ],
  },

  faq: {
    title: 'FAQ',
    description: 'Questions fréquentes affichées sur l’accueil.',
    itemLabel: 'question',
    display: (item) => ({ title: item.question, subtitle: item.answer }),
    create: () => ({ question: '', answer: '' }),
    fields: [
      { name: 'question', label: 'Question', type: 'text', required: true },
      { name: 'answer', label: 'Réponse', type: 'textarea', rows: 6, required: true },
    ],
  },

  serviceOffer: {
    itemLabel: 'offre',
    display: (item) => ({ title: item.title, subtitle: item.price ? `Dès ${item.price} FCFA` : 'Sur devis' }),
    create: () => ({ title: '', description: '', price: '', features: [], featured: false }),
    fields: [
      { name: 'title', label: 'Titre', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
      { name: 'price', label: 'Prix de départ (FCFA)', type: 'text', help: 'Ex. : 150 000. Laissez vide pour afficher « Sur devis ».' },
      { name: 'features', label: 'Points forts (un par ligne)', type: 'lines' },
      { name: 'featured', label: 'Mettre en avant (carte violette)', type: 'checkbox' },
    ],
  },

  serviceStep: {
    itemLabel: 'étape',
    display: (item) => ({ title: item.title, subtitle: item.text }),
    create: () => ({ title: '', text: '' }),
    fields: [
      { name: 'title', label: 'Titre', type: 'text', required: true },
      { name: 'text', label: 'Texte', type: 'textarea', rows: 2 },
    ],
  },
};

// Returns the list of problems that block saving
export function validate(schema, items, isUnique) {
  const errors = [];
  items.forEach((item, index) => {
    for (const field of schema.fields) {
      if (!field.required) continue;
      const value = item[field.name];
      const empty = Array.isArray(value) ? value.length === 0 : !String(value ?? '').trim();
      if (empty) errors.push({ index, message: `${field.label} est obligatoire` });
    }
  });
  if (isUnique) {
    const seen = new Map();
    items.forEach((item, index) => {
      const key = isUnique(item);
      if (!key) return;
      if (seen.has(key)) errors.push({ index, message: `Adresse « ${key} » déjà utilisée par un autre élément` });
      seen.set(key, index);
    });
  }
  return errors;
}
