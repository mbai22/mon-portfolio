import { useEffect, useMemo, useState } from 'react';
import { ContentContext, fetchRemoteContent, mergeContent } from './store';

export function ContentProvider({ children }) {
  const [remote, setRemote] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchRemoteContent()
      .then((data) => { if (!cancelled) setRemote(data); })
      .catch(() => { /* keep defaults */ })
      .finally(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, [version]);

  const value = useMemo(() => ({
    content: mergeContent(remote),
    loaded,
    reload: () => setVersion((v) => v + 1),
  }), [remote, loaded]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
