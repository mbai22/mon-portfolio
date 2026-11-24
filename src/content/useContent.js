import { useContext, useMemo } from 'react';
import { ContentContext } from './store';
import { normalizePost } from '../data/posts';

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

export function useContentStatus() {
  const { loaded, reload } = useContext(ContentContext);
  return { loaded, reload };
}
