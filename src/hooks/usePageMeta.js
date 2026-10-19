import { useEffect } from 'react';

export const SITE_URL = 'https://willydev.online';

// Defaults mirror the static tags in index.html (home page).
const DEFAULTS = {
  title: "Développeur web & mobile, design graphique et montage vidéo | Willy Dev, N'Djamena",
  description: "Willy Dev crée vos applications web et mobiles, sites internet, logos et identités visuelles, et réalise vos montages vidéo à N'Djamena, au Tchad. Devis gratuit.",
  image: `${SITE_URL}/assets/img/about_willy.jpeg`,
  type: 'website',
};

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// Updates title, description, canonical, Open Graph / Twitter tags and an optional
// JSON-LD block for the current page. Every value falls back to the home page.
export function usePageMeta({ title, description, path = '/', image, type, jsonLd } = {}) {
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : null;

  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    const pageTitle = title ?? DEFAULTS.title;
    const pageDescription = description ?? DEFAULTS.description;
    const pageImage = image ?? DEFAULTS.image;

    document.title = pageTitle;
    setCanonical(url);
    setMeta('name', 'description', pageDescription);
    setMeta('property', 'og:type', type ?? DEFAULTS.type);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:title', pageTitle);
    setMeta('property', 'og:description', pageDescription);
    setMeta('property', 'og:image', pageImage);
    setMeta('name', 'twitter:title', pageTitle);
    setMeta('name', 'twitter:description', pageDescription);
    setMeta('name', 'twitter:image', pageImage);

    // The home portrait size and alt text in index.html don't apply to other images
    if (image) {
      ['og:image:width', 'og:image:height', 'og:image:alt'].forEach((key) =>
        document.head.querySelector(`meta[property="${key}"]`)?.remove());
    }

    let script;
    if (jsonLdString) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.pageMeta = '';
      script.textContent = jsonLdString;
      document.head.appendChild(script);
    }
    return () => script?.remove();
  }, [title, description, path, image, type, jsonLdString]);
}
