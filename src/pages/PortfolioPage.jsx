import { useEffect, useState } from 'react';
import { Code2, PenTool, Clapperboard, Play, X, ChevronsRight } from 'lucide-react';
import Eyebrow from '../components/Eyebrow';
import ProjectCard from '../components/ProjectCard';
import { projects, filters } from '../data/projects';
import { designWorks, designCategories, videoWorks, videoCategories } from '../data/portfolio';
import { usePageMeta } from '../hooks/usePageMeta';
import { useSectionNav } from '../hooks/useSectionNav';

// Filter tabs only list categories that actually have work in them
const usedCategories = (categories, works) => ['Tous', ...categories.filter((c) => works.some((w) => w.category === c))];
const designFilters = usedCategories(designCategories, designWorks);
const videoFilters = usedCategories(videoCategories, videoWorks);

const sections = [
  { id: 'realisations-code', label: 'Développement', icon: Code2, count: projects.length },
  { id: 'realisations-design', label: 'Design graphique', icon: PenTool, count: designWorks.length },
  { id: 'realisations-video', label: 'Montage vidéo', icon: Clapperboard, count: videoWorks.length },
];

function useFilter(items, key, allLabel = 'Tous') {
  const [active, setActive] = useState(allLabel);
  const filtered = active === allLabel ? items : items.filter((item) => item[key] === active);
  return { active, setActive, filtered };
}

function FilterTabs({ options, active, onChange }) {
  return (
    <div className="pill-tabs">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`pill-tab${active === option ? ' active' : ''}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function SectionHead({ eyebrow, title, text, children }) {
  return (
    <div className="pf-head">
      <div className="pf-head-text">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="section-title">{title}</h2>
        <p className="section-text">{text}</p>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ icon, title, text }) {
  const goTo = useSectionNav();
  return (
    <div className="pf-empty">
      <span className="pf-empty-icon">{icon}</span>
      <h3 className="pf-empty-title display">{title}</h3>
      <p>{text}</p>
      <a href="/#contact" onClick={goTo('contact')} className="btn-pill">
        Demander un devis
        <span className="circle-icon"><ChevronsRight size={16} /></span>
      </a>
    </div>
  );
}

function Lightbox({ work, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="pf-lightbox" role="dialog" aria-modal="true" aria-label={work.title} onClick={onClose}>
      <button className="pf-lightbox-close" onClick={onClose} aria-label="Fermer">
        <X size={22} />
      </button>
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={work.image} alt={work.title} />
        <figcaption>
          <strong>{work.title}</strong>
          {work.client && <span> · {work.client}</span>}
        </figcaption>
      </figure>
    </div>
  );
}

function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false);
  const poster = video.poster ?? (video.youtubeId ? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg` : undefined);

  return (
    <article className="pf-video">
      <div className="pf-video-frame">
        {playing ? (
          video.youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <video src={video.src} poster={poster} controls autoPlay playsInline />
          )
        ) : (
          <button className="pf-video-poster" onClick={() => setPlaying(true)} aria-label={`Lire la vidéo : ${video.title}`}>
            {poster && <img src={poster} alt="" loading="lazy" />}
            <span className="pf-video-play"><Play size={24} fill="currentColor" /></span>
          </button>
        )}
      </div>
      <div className="pf-video-body">
        <span className="media-card-kicker display">{video.category}</span>
        <h3 className="media-card-title">{video.title}</h3>
        {video.client && <p className="media-card-meta">{video.client}</p>}
      </div>
    </article>
  );
}

export default function PortfolioPage() {
  const code = useFilter(projects, 'type');
  const design = useFilter(designWorks, 'category');
  const video = useFilter(videoWorks, 'category');
  const [openWork, setOpenWork] = useState(null);
  const goTo = useSectionNav();

  usePageMeta({
    title: "Portfolio : applications web et mobiles, design graphique, montage vidéo | Willy Dev",
    description: "Toutes les réalisations de Willy Dev à N'Djamena : sites internet et applications web et mobiles, logos et identités visuelles, montages vidéo.",
    path: '/portfolio',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main>
      <header className="pf-hero section-darker">
        <div className="container section-head">
          <Eyebrow>Portfolio</Eyebrow>
          <h1 className="section-title">Toutes mes réalisations</h1>
          <p className="section-text">
            Sites internet et applications web et mobiles, design graphique et montage vidéo : une sélection de projets réalisés pour mes clients.
          </p>
          <nav className="pf-jump" aria-label="Sections du portfolio">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} onClick={scrollTo(section.id)} className="pf-jump-link">
                <span className="pf-jump-icon"><section.icon size={18} /></span>
                <span className="pf-jump-label">{section.label}</span>
                <span className={`pf-jump-count${section.count ? '' : ' soon'}`}>{section.count || 'Bientôt'}</span>
              </a>
            ))}
          </nav>
        </div>
      </header>

      <section id="realisations-code" className="section section-light pf-section">
        <div className="container">
          <SectionHead
            eyebrow="Développement"
            title="Sites internet et applications web & mobiles"
            text="Sites vitrines, e-commerce, applications web et mobiles, tableaux de bord et API."
          >
            <FilterTabs options={filters} active={code.active} onChange={code.setActive} />
          </SectionHead>
          <div className="cards-grid">
            {code.filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section id="realisations-design" className="section section-dark pf-section">
        <div className="container">
          <SectionHead
            eyebrow="Design graphique"
            title="Visuels, flyers et supports de communication"
            text="Publications et couvertures pour les réseaux sociaux, flyers, cartes de visite et identités visuelles."
          >
            {designWorks.length > 0 && (
              <FilterTabs options={designFilters} active={design.active} onChange={design.setActive} />
            )}
          </SectionHead>
          {designWorks.length > 0 ? (
            <div className="pf-design-grid">
              {design.filtered.map((work) => (
                <button
                  key={work.id}
                  className={`pf-design-item${work.category === 'Logo' ? ' is-logo' : ''}`}
                  onClick={() => setOpenWork(work)}
                  aria-label={`Agrandir : ${work.title}`}
                >
                  <img src={work.image} alt={`${work.title}, ${work.category.toLowerCase()} réalisé pour ${work.client}`} loading="lazy" />
                  <span className="pf-design-caption">
                    <span className="pf-design-category">{work.category}</span>
                    <span className="pf-design-title">{work.title}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<PenTool size={26} />}
              title="Réalisations bientôt en ligne"
              text="Les logos, identités visuelles et supports graphiques réalisés pour mes clients arrivent ici très bientôt."
            />
          )}
        </div>
      </section>

      <section id="realisations-video" className="section section-light pf-section">
        <div className="container">
          <SectionHead
            eyebrow="Montage vidéo"
            title="Spots, clips et vidéos pour les réseaux"
            text="Montage, motion design, spots publicitaires et contenus courts pour Facebook, Instagram et TikTok."
          >
            {videoWorks.length > 0 && (
              <FilterTabs options={videoFilters} active={video.active} onChange={video.setActive} />
            )}
          </SectionHead>
          {videoWorks.length > 0 ? (
            <div className="pf-video-grid">
              {video.filtered.map((item) => (
                <VideoCard key={item.id} video={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Clapperboard size={26} />}
              title="Vidéos bientôt en ligne"
              text="Les spots publicitaires, clips et montages réalisés pour mes clients arrivent ici très bientôt."
            />
          )}
          <div className="cards-cta">
            <a href="/#contact" onClick={goTo('contact')} className="btn-pill">
              Discutons de votre projet
              <span className="circle-icon"><ChevronsRight size={16} /></span>
            </a>
          </div>
        </div>
      </section>

      {openWork && <Lightbox work={openWork} onClose={() => setOpenWork(null)} />}
    </main>
  );
}
