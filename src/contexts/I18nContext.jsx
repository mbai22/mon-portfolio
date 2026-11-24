import { useCallback, useEffect, useMemo, useState } from 'react';
import { I18nContext, LOCALES, STORAGE_KEY, makeT } from '../i18n/context';

// The site is rendered in French first (also by the build-time prerender), then switches
// to the visitor's saved language, or to Arabic / English if that is their browser language.
function preferredLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LOCALES.includes(saved)) return saved;
  } catch { /* storage blocked */ }
  const browser = (navigator.language || '').slice(0, 2);
  return browser === 'ar' || browser === 'en' ? browser : 'fr';
}

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState('fr');

  useEffect(() => {
    const preferred = preferredLocale();
    if (preferred === 'fr') return undefined;
    // after hydration, so the first render matches the prerendered French HTML
    const id = setTimeout(() => setLocale(preferred), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const setLanguage = useCallback((lang) => {
    if (!LOCALES.includes(lang)) return;
    setLocale(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* storage blocked */ }
  }, []);

  const value = useMemo(() => ({
    locale,
    t: makeT(locale),
    setLanguage,
    dir: locale === 'ar' ? 'rtl' : 'ltr',
  }), [locale, setLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
