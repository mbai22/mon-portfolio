import { useId, useRef, useState } from 'react';
import { Star, Upload, Loader2, ImageOff } from 'lucide-react';
import { uploadImage } from './api';
import { bodyToText, slugify, textToBody, youtubeId } from './schemas';

function ImageField({ id, value, onChange }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [broken, setBroken] = useState(false);

  const pick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const { url } = await uploadImage(file);
      setBroken(false);
      onChange(url);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-image-field">
      <div className="adm-image-preview">
        {value && !broken
          ? <img src={value} alt="" onError={() => setBroken(true)} />
          : <span className="adm-image-empty"><ImageOff size={22} />{value ? 'Image introuvable' : 'Aucune image'}</span>}
      </div>
      <div className="adm-image-actions">
        <button type="button" className="adm-btn adm-btn-secondary" onClick={() => input.current?.click()} disabled={busy}>
          {busy ? <Loader2 size={16} className="adm-spin" /> : <Upload size={16} />}
          {busy ? 'Envoi…' : value ? 'Remplacer l’image' : 'Envoyer une image'}
        </button>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={pick} />
        <input
          id={id}
          className="adm-input adm-input-sm"
          value={value || ''}
          placeholder="ou collez un lien d’image"
          onChange={(e) => { setBroken(false); onChange(e.target.value); }}
        />
        {error && <p className="adm-field-error">{error}</p>}
      </div>
    </div>
  );
}

function BodyField({ id, value, onChange }) {
  // Keep the raw text while typing; the structured body is derived from it
  const [text, setText] = useState(() => bodyToText(value));
  return (
    <>
      <textarea
        id={id}
        className="adm-input adm-textarea adm-textarea-body"
        rows={18}
        value={text}
        onChange={(e) => { setText(e.target.value); onChange(textToBody(e.target.value)); }}
      />
      <p className="adm-help">
        Une ligne vide sépare les paragraphes. <code>## Titre</code> crée un intertitre, <code>- élément</code> une liste à puces.
      </p>
    </>
  );
}

function RatingField({ value = 5, onChange }) {
  return (
    <div className="adm-rating" role="radiogroup" aria-label="Note">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
          className={n <= value ? 'on' : ''}
          onClick={() => onChange(n)}
        >
          <Star size={20} fill={n <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
}

export function Field({ field, item, onChange, options }) {
  const id = useId();
  const value = item[field.name];
  const set = (v) => onChange(field.name, v);
  const listId = field.suggestions ? `${id}-list` : undefined;

  if (field.type === 'checkbox') {
    return (
      <label className="adm-check">
        <input type="checkbox" checked={!!value} onChange={(e) => set(e.target.checked)} />
        <span>{field.label}</span>
      </label>
    );
  }

  let control;
  switch (field.type) {
    case 'textarea':
      control = (
        <textarea id={id} className="adm-input adm-textarea" rows={field.rows || 4} value={value || ''}
          maxLength={field.max} onChange={(e) => set(e.target.value)} />
      );
      break;
    case 'image':
      control = <ImageField id={id} value={value} onChange={set} />;
      break;
    case 'body':
      control = <BodyField id={id} value={value} onChange={set} />;
      break;
    case 'rating':
      control = <RatingField value={value} onChange={set} />;
      break;
    case 'date':
      control = <input id={id} type="date" className="adm-input" value={value || ''} onChange={(e) => set(e.target.value)} />;
      break;
    case 'number':
      control = (
        <div className={field.suffix ? 'adm-prefixed adm-suffixed' : undefined}>
          <input id={id} type="number" inputMode="decimal" className="adm-input" min={field.min} max={field.max} step={field.step || 1}
            value={value ?? ''} onChange={(e) => set(e.target.value === '' ? '' : Number(e.target.value))} />
          {field.suffix && <span>{field.suffix}</span>}
        </div>
      );
      break;
    case 'checklist': {
      const list = options[field.options] || [];
      const selected = Array.isArray(value) ? value : [];
      control = (
        <div className="adm-checklist" id={id}>
          {list.map((o) => (
            <label key={o.value} className="adm-check">
              <input type="checkbox" checked={selected.includes(o.value)}
                onChange={(e) => set(e.target.checked ? [...selected, o.value] : selected.filter((v) => v !== o.value))} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      );
      break;
    }
    case 'select':
      control = (
        <select id={id} className="adm-input" value={value || ''} onChange={(e) => set(e.target.value)}>
          <option value="" disabled>Choisir…</option>
          {(options[field.options] || []).map((o) => <option key={o} value={o}>{o}</option>)}
          {value && !(options[field.options] || []).includes(value) && <option value={value}>{value}</option>}
        </select>
      );
      break;
    case 'lines':
      control = (
        <textarea id={id} className="adm-input adm-textarea" rows={4}
          value={(value || []).join('\n')}
          onChange={(e) => set(e.target.value.split('\n'))}
          onBlur={(e) => set(e.target.value.split('\n').map((l) => l.trim()).filter(Boolean))} />
      );
      break;
    case 'slug': {
      const auto = slugify(item[field.from]);
      control = (
        <div className="adm-prefixed">
          <span>{field.prefix}</span>
          <input id={id} className="adm-input" value={value || ''} placeholder={auto || 'mon-article'}
            onChange={(e) => set(e.target.value)} onBlur={(e) => set(slugify(e.target.value))} />
        </div>
      );
      break;
    }
    case 'youtube':
      control = (
        <input id={id} className="adm-input" value={value || ''} placeholder="https://www.youtube.com/watch?v=…"
          onChange={(e) => set(e.target.value)} onBlur={(e) => set(youtubeId(e.target.value))} />
      );
      break;
    default:
      control = (
        <input id={id} className="adm-input" value={value ?? ''} list={listId} onChange={(e) => set(e.target.value)} />
      );
  }

  return (
    <div className="adm-field">
      <label htmlFor={id} className="adm-label">
        {field.label}{field.required && <span className="adm-required" aria-hidden="true"> *</span>}
      </label>
      {control}
      {listId && (
        <datalist id={listId}>
          {(options[field.suggestions] || []).map((o) => <option key={o} value={o} />)}
        </datalist>
      )}
      {field.max && <p className="adm-help">{String(value || '').length} / {field.max} caractères</p>}
      {field.help && <p className="adm-help">{field.help}</p>}
    </div>
  );
}
