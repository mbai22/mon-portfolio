// Privacy-friendly visit statistics (see public/api/track.php): no cookie, no IP stored.
// Only sends in production so local development doesn't pollute the numbers.

function send(payload) {
  if (!import.meta.env.PROD || typeof window === 'undefined') return;
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track.php', new Blob([body], { type: 'application/json' }));
    } else {
      fetch('/api/track.php', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true });
    }
  } catch { /* statistics must never break the site */ }
}

let lastPath = '';
export function trackView(path) {
  if (path === lastPath) return;
  const first = lastPath === '';
  lastPath = path;
  send({ type: 'view', path, ref: first ? document.referrer : '' });
}

export function trackEvent(name) {
  send({ type: 'event', name });
}

// WhatsApp and e-mail links anywhere on the site
export function trackOutboundClicks() {
  const onClick = (e) => {
    const link = e.target.closest?.('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (href.includes('wa.me/')) trackEvent('whatsapp');
    else if (href.startsWith('mailto:')) trackEvent('email');
  };
  document.addEventListener('click', onClick, { capture: true });
  return () => document.removeEventListener('click', onClick, { capture: true });
}
