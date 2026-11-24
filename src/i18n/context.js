import { createContext, useContext } from 'react';
import fr from './fr';
import en from './en';
import ar from './ar';

export const DICTIONARIES = { fr, en, ar };
export const LOCALES = ['fr', 'en', 'ar'];
export const STORAGE_KEY = 'wd-lang';

const lookup = (dict, key) => key.split('.').reduce((v, k) => (v && typeof v === 'object' ? v[k] : undefined), dict);

// t('hero.title1') or t('contact.chars', { n: 12 }); falls back to French, then to the key itself
export function makeT(locale) {
  return (key, vars) => {
    let value = lookup(DICTIONARIES[locale], key);
    if (value === undefined) value = lookup(fr, key);
    if (value === undefined) return key;
    if (typeof value === 'string' && vars) {
      value = value.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
    }
    return value;
  };
}

export const I18nContext = createContext({ locale: 'fr', t: makeT('fr'), setLanguage: () => {}, dir: 'ltr' });

export function useI18n() {
  return useContext(I18nContext);
}
