import { useContext, useMemo } from 'react';
import { ContentContext } from './store';
import { normalizePost } from '../data/posts';
import { useI18n } from '../i18n/context';
import { translatedBooking, translatedEstimator } from '../i18n/contentLabels';

export function useContent() {
  return useContext(ContentContext).content;
}

export function useProjects() {
  const { projects } = useContent();
  return useMemo(() => ({
    projects,
    filters: ['Tous', ...new Set(projects.map((p) => p.type).filter(Boolean))],
  }), [projects]);
}

// Newest first, with cover/thumbnail URLs resolved
export function usePosts() {
  const { posts } = useContent();
  return useMemo(
    () => posts.map(normalizePost).sort((a, b) => String(b.date).localeCompare(String(a.date))),
    [posts],
  );
}

// A content section in the visitor's language: the built-in translation (src/i18n/<lang>.js)
// is used until the section is edited in /admin, after which the admin's version is shown.
export function useLocalizedSection(name) {
  const { content, customized } = useContext(ContentContext);
  const { locale, t } = useI18n();
  if (locale === 'fr' || customized?.has(name)) return content[name];
  if (name === 'estimator') return translatedEstimator(locale) || content[name];
  if (name === 'booking') return translatedBooking(locale) || content[name];
  const translated = t(`content.${name}`);
  return typeof translated === 'object' ? translated : content[name];
}

// Dates in the visitor's language (Arabic keeps Western digits, as used in Chad)
export function useDateFormat() {
  const { t } = useI18n();
  const locale = t('dateLocale');
  return (iso, options = { day: 'numeric', month: 'long', year: 'numeric' }) =>
    (iso ? new Date(`${String(iso).slice(0, 10)}T12:00:00`).toLocaleDateString(locale, options) : '');
}

export function useContentStatus() {
  const { loaded, reload } = useContext(ContentContext);
  return { loaded, reload };
}
