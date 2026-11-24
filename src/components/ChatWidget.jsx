import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { trackEvent } from '../content/track';
import { useI18n } from '../i18n/context';

const STORE = 'wd-chat';

// Turns the site paths the assistant mentions (/devis, /rendez-vous, /audit) into links
function Rich({ text }) {
  const parts = text.split(/(\/(?:devis|rendez-vous|audit|portfolio)\b)/g);
  return parts.map((p, i) => (/^\/(devis|rendez-vous|audit|portfolio)$/.test(p)
    ? <Link key={i} to={p} className="chat-link">{p}</Link>
    : <span key={i}>{p}</span>));
}

export default function ChatWidget() {
  const { t } = useI18n();
  const GREETING = { role: 'assistant', content: t('chat.greeting') };
  const [available, setAvailable] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(STORE)) || []; } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetch('/api/chat.php').then((r) => r.json()).then((d) => setAvailable(!!d.available)).catch(() => {});
  }, []);

  useEffect(() => {
    try { sessionStorage.setItem(STORE, JSON.stringify(messages.slice(-30))); } catch { /* private mode */ }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!available) return null;

  const send = async (text) => {
    const content = text.trim();
    if (!content || busy) return;
    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setError('');
    setBusy(true);
    if (!messages.length) trackEvent('chat');
    try {
      const res = await fetch('/api/chat.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // the greeting is UI only and is not part of the history sent to the server
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || t('chat.error'));
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`chat${open ? ' open' : ''}`}>
      {open && (
        <section className="chat-panel" role="dialog" aria-label={t('chat.title')}>
          <header className="chat-head">
            <span className="chat-avatar"><Sparkles size={16} /></span>
            <div>
              <strong>{t('chat.title')}</strong>
              <span>{t('chat.subtitle')}</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label={t('chat.close')}><X size={18} /></button>
          </header>

          <div className="chat-list" ref={listRef} aria-live="polite">
            {[GREETING, ...messages].map((m, i) => (
              <p key={i} className={`chat-msg ${m.role}`}><Rich text={m.content} /></p>
            ))}
            {busy && <p className="chat-msg assistant typing"><Loader2 size={15} className="spin" /> {t('chat.typing')}</p>}
            {error && <p className="chat-error" role="alert">{error}</p>}
            {messages.length === 0 && !busy && (
              <div className="chat-suggestions">
                {t('chat.suggestions').map((s) => <button key={s} type="button" onClick={() => send(s)}>{s}</button>)}
              </div>
            )}
          </div>

          <form className="chat-form" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} maxLength={1000}
              placeholder={t('chat.placeholder')} aria-label={t('chat.placeholder')} />
            <button disabled={busy || !input.trim()} aria-label={t('chat.send')}><Send size={17} /></button>
          </form>
        </section>
      )}

      <button type="button" className="chat-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}
        aria-label={open ? t('chat.close') : t('chat.open')}>
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
