import { useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { useI18n } from '../i18n/context';

// Drag (or use the arrow keys) to reveal the "after" image over the "before" one
export function BeforeAfterSlider({ before, after, title }) {
  const [pos, setPos] = useState(50);
  const { t } = useI18n();

  return (
    <div className="ba-slider" style={{ '--ba-pos': `${pos}%` }}>
      <img src={before} alt={`${title}, ${t('pf.baBefore')}`} className="ba-img" loading="lazy" draggable="false" />
      <div className="ba-after" aria-hidden="true">
        <img src={after} alt="" className="ba-img" loading="lazy" draggable="false" />
      </div>
      <span className="ba-tag ba-tag-before">{t('pf.baBefore')}</span>
      <span className="ba-tag ba-tag-after">{t('pf.baAfter')}</span>
      <span className="ba-handle" aria-hidden="true"><MoveHorizontal size={18} /></span>
      <input
        type="range"
        min="0"
        max="100"
        step="0.5"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="ba-range"
        aria-label={t('pf.baCompare', { title })}
      />
    </div>
  );
}

export default function BeforeAfterList({ items }) {
  return (
    <div className="ba-grid">
      {items.map((item) => (
        <article key={item.id || item.title} className="ba-card">
          <BeforeAfterSlider before={item.before} after={item.after} title={item.title} />
          <div className="ba-body">
            <h3 className="media-card-kicker display">{item.title}</h3>
            {item.client && <p className="media-card-meta">{item.client}</p>}
            {item.description && <p className="media-card-text">{item.description}</p>}
          </div>
        </article>
      ))}
    </div>
  );
}
