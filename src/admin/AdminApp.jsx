import { useCallback, useEffect, useRef, useState } from 'react';
import {
  LayoutDashboard, Code2, PenTool, Clapperboard, Newspaper, MessageSquareQuote, HelpCircle,
  Briefcase, LogOut, ExternalLink, Loader2, Lock, Menu, X, ChevronRight,
  BarChart3, Calculator, SplitSquareHorizontal, CalendarClock, FolderKanban, KeyRound,
} from 'lucide-react';
import { getContent, getSession, login, logout } from './api';
import { mergeContent } from '../content/store';
import { useContentStatus } from '../content/useContent';
import { CollectionPage, ServicesPage } from './pages';
import StatsPage from './StatsPage';
import EstimatorPage from './EstimatorPage';
import BookingAdminPage from './BookingAdminPage';
import ClientsAdminPage from './ClientsAdminPage';
import SettingsPage from './SettingsPage';
import './admin.css';

const NAV = [
  { id: 'overview', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'stats', label: 'Statistiques', icon: BarChart3 },
  { group: 'Clients' },
  { id: 'bookings', label: 'Rendez-vous', icon: CalendarClock, sections: ['booking'] },
  { id: 'clients', label: 'Espace client', icon: FolderKanban },
  { id: 'estimator', label: 'Estimateur de devis', icon: Calculator, sections: ['estimator'] },
  { group: 'Portfolio' },
  { id: 'projects', label: 'Projets web', icon: Code2, sections: ['projects'] },
  { id: 'design', label: 'Design graphique', icon: PenTool, sections: ['designWorks', 'designCategories'] },
  { id: 'video', label: 'Montage vidéo', icon: Clapperboard, sections: ['videoWorks', 'videoCategories'] },
  { id: 'beforeAfter', label: 'Avant / après', icon: SplitSquareHorizontal, sections: ['beforeAfter'] },
  { group: 'Contenus' },
  { id: 'blog', label: 'Blog', icon: Newspaper, sections: ['posts'] },
  { id: 'testimonials', label: 'Témoignages', icon: MessageSquareQuote, sections: ['testimonials'] },
  { id: 'faq', label: 'FAQ', icon: HelpCircle, sections: ['faq'] },
  { id: 'services', label: 'Services', icon: Briefcase, sections: ['services'] },
  { group: 'Réglages' },
  { id: 'settings', label: 'Clés & configuration', icon: KeyRound },
];
const PAGES = NAV.filter((n) => n.id);

// Session + (when logged in) the content saved from the admin
async function fetchSessionState() {
  try {
    const session = await getSession();
    const remote = session.authenticated ? (await getContent()) || {} : null;
    return { session, remote, error: '' };
  } catch (e) {
    return { session: { authenticated: false }, remote: null, error: e.message };
  }
}

function usePageMetaAdmin() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Administration | Willy Dev';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => { document.title = prevTitle; robots.remove(); };
  }, []);
}

function Login({ configured, needsUsername, onDone }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(username, password);
      onDone();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="adm-login">
      <form className="adm-login-card" onSubmit={submit}>
        <img src="/assets/logo-hero.png" alt="Willy Dev" className="adm-login-logo" />
        <h1>Administration</h1>
        {configured === false ? (
          <p className="adm-notice">
            L’admin n’est pas encore activé sur ce serveur : le fichier <code>willydev-admin.php</code> contenant le mot de passe
            est absent. Suivez la procédure d’installation du fichier <code>ADMIN.md</code>.
          </p>
        ) : (
          <>
            {needsUsername && (
              <label className="adm-field">
                <span className="adm-label">Nom d’utilisateur</span>
                <input className="adm-input" value={username} autoFocus autoComplete="username"
                  onChange={(e) => setUsername(e.target.value)} required />
              </label>
            )}
            <label className="adm-field">
              <span className="adm-label">Mot de passe</span>
              <input type="password" className="adm-input" value={password} autoFocus={!needsUsername} autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)} required />
            </label>
            {error && <p className="adm-field-error" role="alert">{error}</p>}
            <button className="adm-btn adm-btn-primary adm-btn-block" disabled={busy || !password || (needsUsername && !username.trim())}>
              {busy ? <Loader2 size={16} className="adm-spin" /> : <Lock size={16} />} Se connecter
            </button>
          </>
        )}
        <a href="/" className="adm-login-back">← Retour au site</a>
      </form>
    </div>
  );
}

function Overview({ content, customized, go }) {
  const cards = [
    { id: 'projects', label: 'Projets web', count: content.projects.length, icon: Code2, sections: ['projects'] },
    { id: 'design', label: 'Réalisations design', count: content.designWorks.length, icon: PenTool, sections: ['designWorks', 'designCategories'] },
    { id: 'video', label: 'Vidéos', count: content.videoWorks.length, icon: Clapperboard, sections: ['videoWorks', 'videoCategories'] },
    { id: 'blog', label: 'Articles', count: content.posts.length, icon: Newspaper, sections: ['posts'] },
    { id: 'testimonials', label: 'Témoignages', count: content.testimonials.length, icon: MessageSquareQuote, sections: ['testimonials'] },
    { id: 'faq', label: 'Questions FAQ', count: content.faq.length, icon: HelpCircle, sections: ['faq'] },
    { id: 'services', label: 'Offres de services', count: (content.services.categories || []).reduce((n, c) => n + (c.services?.length || 0), 0), icon: Briefcase, sections: ['services'] },
  ];
  const latest = [...content.posts].sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1>Bonjour Willy</h1>
          <p>Gérez le contenu de willydev.online. Chaque enregistrement met le site à jour immédiatement, sans redéploiement.</p>
        </div>
      </header>

      <div className="adm-stats">
        {cards.map((c) => (
          <button key={c.id} type="button" className="adm-stat" onClick={() => go(c.id)}>
            <span className="adm-stat-icon"><c.icon size={20} /></span>
            <span className="adm-stat-count">{c.count}</span>
            <span className="adm-stat-label">{c.label}</span>
            <span className={`adm-badge${c.sections.some((s) => customized.has(s)) ? ' on' : ''}`}>
              {c.sections.some((s) => customized.has(s)) ? 'Modifié' : 'Origine'}
            </span>
          </button>
        ))}
      </div>

      <div className="adm-grid-2">
        <section className="adm-card">
          <h2 className="adm-card-title">Actions rapides</h2>
          <ul className="adm-quick">
            <li><button type="button" onClick={() => go('blog')}>Écrire un article <ChevronRight size={16} /></button></li>
            <li><button type="button" onClick={() => go('design')}>Ajouter une réalisation design <ChevronRight size={16} /></button></li>
            <li><button type="button" onClick={() => go('projects')}>Ajouter un projet web <ChevronRight size={16} /></button></li>
            <li><button type="button" onClick={() => go('testimonials')}>Ajouter un témoignage <ChevronRight size={16} /></button></li>
          </ul>
        </section>
        <section className="adm-card">
          <h2 className="adm-card-title">Dernier article</h2>
          {latest ? (
            <div className="adm-latest">
              <p className="adm-latest-title">{latest.title}</p>
              <p className="adm-help">{latest.category} · {latest.date}</p>
              <a className="adm-link" href={`/blog/${latest.slug}`} target="_blank" rel="noreferrer">
                Voir sur le site <ExternalLink size={14} />
              </a>
            </div>
          ) : <p className="adm-empty">Aucun article.</p>}
          <p className="adm-help adm-mt">
            « Origine » : le contenu livré avec le site. « Modifié » : la version enregistrée depuis l’admin, qui remplace l’origine.
          </p>
        </section>
      </div>
    </>
  );
}

export default function AdminApp() {
  usePageMetaAdmin();
  const { reload: reloadSite } = useContentStatus();
  const [session, setSession] = useState(null); // null = loading
  const [sessionError, setSessionError] = useState('');
  const [content, setContent] = useState(null);
  const [customized, setCustomized] = useState(new Set());
  const [page, setPage] = useState(() => {
    const hash = window.location.hash.slice(1);
    return PAGES.some((p) => p.id === hash) ? hash : 'overview';
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const dirtyRef = useRef(new Set());

  const applySession = useCallback((state) => {
    setSessionError(state.error);
    setSession(state.session);
    if (state.remote) {
      setContent(mergeContent(state.remote));
      setCustomized(new Set(Object.keys(state.remote)));
    }
  }, []);

  const loadSession = useCallback(() => fetchSessionState().then(applySession), [applySession]);

  useEffect(() => {
    let cancelled = false;
    fetchSessionState().then((state) => { if (!cancelled) applySession(state); });
    return () => { cancelled = true; };
  }, [applySession]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (dirtyRef.current.size) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  // Links like /admin#blog typed or pasted while the admin is open
  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.slice(1) || 'overview';
      if (!PAGES.some((p) => p.id === id)) return;
      if (dirtyRef.current.size && !window.confirm('Vous avez des modifications non enregistrées. Quitter cette page quand même ?')) return;
      dirtyRef.current.clear();
      setPage(id);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const onDirty = useCallback((section, dirty) => {
    if (dirty) dirtyRef.current.add(section); else dirtyRef.current.delete(section);
  }, []);

  const onSaved = useCallback((section, data, reset = false) => {
    setContent((c) => ({ ...c, [section]: data }));
    setCustomized((prev) => {
      const next = new Set(prev);
      if (reset) next.delete(section); else next.add(section);
      return next;
    });
    reloadSite();
  }, [reloadSite]);

  const go = (id) => {
    if (id === page) { setMenuOpen(false); return; }
    if (dirtyRef.current.size && !window.confirm('Vous avez des modifications non enregistrées. Quitter cette page quand même ?')) return;
    dirtyRef.current.clear();
    setPage(id);
    setMenuOpen(false);
    window.history.replaceState(null, '', id === 'overview' ? '/admin' : `/admin#${id}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const signOut = async () => {
    if (dirtyRef.current.size && !window.confirm('Des modifications ne sont pas enregistrées. Se déconnecter quand même ?')) return;
    await logout();
    dirtyRef.current.clear();
    setContent(null);
    await loadSession();
  };

  if (session === null) {
    return <div className="adm-boot"><Loader2 size={28} className="adm-spin" /></div>;
  }

  if (!session.authenticated) {
    return (
      <>
        {sessionError && <p className="adm-banner-error">{sessionError}</p>}
        <Login configured={session.configured} needsUsername={session.needsUsername} onDone={loadSession} />
      </>
    );
  }

  if (!content) {
    return <div className="adm-boot"><Loader2 size={28} className="adm-spin" /></div>;
  }

  const shared = { content, customized, onSaved, onDirty };
  let body;
  switch (page) {
    case 'projects': body = <CollectionPage key="projects" section="projects" {...shared} />; break;
    case 'design': body = <CollectionPage key="design" section="designWorks" categoriesSection="designCategories" {...shared} />; break;
    case 'video': body = <CollectionPage key="video" section="videoWorks" categoriesSection="videoCategories" {...shared} />; break;
    case 'blog': body = <CollectionPage key="blog" section="posts" {...shared} />; break;
    case 'testimonials': body = <CollectionPage key="testimonials" section="testimonials" {...shared} />; break;
    case 'faq': body = <CollectionPage key="faq" section="faq" {...shared} />; break;
    case 'services': body = <ServicesPage key="services" {...shared} />; break;
    case 'beforeAfter': body = <CollectionPage key="beforeAfter" section="beforeAfter" {...shared} />; break;
    case 'stats': body = <StatsPage key="stats" />; break;
    case 'estimator': body = <EstimatorPage key="estimator" {...shared} />; break;
    case 'bookings': body = <BookingAdminPage key="bookings" {...shared} />; break;
    case 'clients': body = <ClientsAdminPage key="clients" onDirty={onDirty} />; break;
    case 'settings': body = <SettingsPage key="settings" />; break;
    default: body = <Overview content={content} customized={customized} go={go} />;
  }

  return (
    <div className="adm">
      <aside className={`adm-sidebar${menuOpen ? ' open' : ''}`}>
        <div className="adm-brand">
          <img src="/assets/logo-hero.png" alt="Willy Dev" />
          <span>Admin</span>
        </div>
        <nav className="adm-nav" aria-label="Administration">
          {NAV.map((item) => item.group ? (
            <p key={item.group} className="adm-nav-group">{item.group}</p>
          ) : (
            <button key={item.id} type="button" className={`adm-nav-link${page === item.id ? ' active' : ''}`}
              aria-current={page === item.id ? 'page' : undefined} onClick={() => go(item.id)}>
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.sections?.some((s) => customized.has(s)) && <span className="adm-dot" title="Modifié depuis l’admin" />}
            </button>
          ))}
        </nav>
        <div className="adm-sidebar-foot">
          <a href="/" target="_blank" rel="noreferrer" className="adm-nav-link"><ExternalLink size={18} /><span>Voir le site</span></a>
          <button type="button" className="adm-nav-link" onClick={signOut}><LogOut size={18} /><span>Déconnexion</span></button>
        </div>
      </aside>

      <div className="adm-main">
        <div className="adm-topbar">
          <button type="button" className="adm-icon-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu" aria-expanded={menuOpen}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span>{PAGES.find((p) => p.id === page)?.label}</span>
        </div>
        {menuOpen && <div className="adm-scrim" onClick={() => setMenuOpen(false)} />}
        <main className="adm-content">{body}</main>
      </div>
    </div>
  );
}
