import { createContext } from 'react';
import { defaultContent } from './defaults';

// Site content = built-in defaults (src/data/*) overridden by the sections edited
// in /admin, which the PHP API serves from /api/content.php. If the API is down
// (or absent, e.g. `vite` without PHP) the site simply shows the defaults.
export const ContentContext = createContext({ content: defaultContent, loaded: true, reload: () => {} });

export function mergeContent(remote) {
  const merged = { ...defaultContent };
  if (remote && typeof remote === 'object') {
    for (const key of Object.keys(defaultContent)) {
      const value = remote[key];
      if (value === undefined || value === null) continue;
      // Only accept the right shape so a bad save can't crash the site
      if (Array.isArray(defaultContent[key]) !== Array.isArray(value)) continue;
      merged[key] = value;
    }
  }
  return merged;
}

export async function fetchRemoteContent() {
  const res = await fetch('/api/content.php', { cache: 'no-store', credentials: 'same-origin' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = res.headers.get('content-type') || '';
  if (!type.includes('application/json')) throw new Error('Not JSON');
  return res.json();
}
