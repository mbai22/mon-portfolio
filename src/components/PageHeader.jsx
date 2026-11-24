import Eyebrow from './Eyebrow';

// Dark header used by the standalone pages (devis, rendez-vous, audit…)
export default function PageHeader({ eyebrow, title, text, children }) {
  return (
    <header className="pf-hero section-darker">
      <div className="container section-head">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="section-title">{title}</h1>
        {text && <p className="section-text">{text}</p>}
        {children}
      </div>
    </header>
  );
}
