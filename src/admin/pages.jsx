import { useMemo, useState } from 'react';
import { Check, Loader2, Plus, RotateCcw, Save, X } from 'lucide-react';
import ListEditor from './ListEditor';
import { schemas, slugify, validate } from './schemas';
import { finalize, useDraft, useShownErrors } from './draft';

export function SaveBar({ dirty, customized, errors, onSave, onRevert, onReset, onBlocked }) {
  const [state, setState] = useState('idle'); // idle | saving | saved | error
  const [message, setMessage] = useState('');
  const [tried, setTried] = useState(false);

  const run = async (fn, okMessage) => {
    setState('saving');
    setMessage('');
    try {
      await fn();
      setState('saved');
      setMessage(okMessage);
      setTimeout(() => setState((s) => (s === 'saved' ? 'idle' : s)), 3000);
    } catch (e) {
      setState('error');
      setMessage(e.message);
    }
  };

  const blocked = errors.length > 0;

  return (
    <div className={`adm-savebar${dirty ? ' dirty' : ''}`}>
      <div className="adm-savebar-status" role="status">
        {state === 'saving' && <><Loader2 size={16} className="adm-spin" /> Enregistrement…</>}
        {state === 'saved' && <><Check size={16} /> {message}</>}
        {state === 'error' && <span className="adm-field-error">{message}</span>}
        {state === 'idle' && (dirty
          ? blocked && tried ? <span className="adm-field-error">{errors.length} champ(s) à corriger avant d’enregistrer (en rouge)</span> : 'Modifications non enregistrées'
          : customized ? 'Contenu modifié depuis l’admin' : 'Contenu d’origine du site')}
      </div>
      <div className="adm-savebar-actions">
        {customized && !dirty && (
          <button type="button" className="adm-btn adm-btn-ghost" disabled={state === 'saving'}
            onClick={() => window.confirm('Revenir au contenu d’origine du site pour cette section ?\nVos modifications faites dans l’admin seront remplacées (une sauvegarde est gardée sur le serveur).')
              && run(onReset, 'Contenu d’origine rétabli')}>
            <RotateCcw size={16} /> Contenu d’origine
          </button>
        )}
        {dirty && (
          <button type="button" className="adm-btn adm-btn-ghost" onClick={onRevert} disabled={state === 'saving'}>
            <X size={16} /> Annuler
          </button>
        )}
        <button type="button" className="adm-btn adm-btn-accent" disabled={!dirty || state === 'saving'}
          onClick={() => {
            if (blocked) { setTried(true); onBlocked?.(); return; }
            setTried(false);
            run(onSave, 'Enregistré, le site est à jour');
          }}>
          <Save size={16} /> Enregistrer
        </button>
      </div>
    </div>
  );
}

export function PageHead({ title, description, children }) {
  return (
    <header className="adm-page-head">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </header>
  );
}

export function ChipsEditor({ label, values, onChange, used = [] }) {
  const [text, setText] = useState('');
  const add = () => {
    const v = text.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setText('');
  };
  return (
    <div className="adm-chips-editor">
      <span className="adm-label">{label}</span>
      <ul className="adm-chips">
        {values.map((v) => (
          <li key={v} className="adm-chip">
            {v}
            <button type="button" aria-label={`Retirer ${v}`} disabled={used.includes(v)}
              title={used.includes(v) ? 'Utilisée par au moins une réalisation' : 'Retirer'}
              onClick={() => onChange(values.filter((x) => x !== v))}>
              <X size={13} />
            </button>
          </li>
        ))}
        <li className="adm-chip-add">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Nouvelle catégorie"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} />
          <button type="button" onClick={add} aria-label="Ajouter la catégorie"><Plus size={14} /></button>
        </li>
      </ul>
    </div>
  );
}

// A list section, optionally with its category list (design / video)
export function CollectionPage({ section, categoriesSection, content, customized, onSaved, onDirty }) {
  const schema = schemas[section];
  const list = useDraft(section, content[section], { onSaved, onDirty });
  const cats = useDraft(categoriesSection || `${section}:none`, categoriesSection ? content[categoriesSection] : [], { onSaved, onDirty });

  const options = useMemo(() => ({
    designCategories: categoriesSection === 'designCategories' ? cats.draft : content.designCategories,
    videoCategories: categoriesSection === 'videoCategories' ? cats.draft : content.videoCategories,
    projectTypes: [...new Set(list.draft.map((p) => p.type).filter(Boolean))],
    postCategories: [...new Set(list.draft.map((p) => p.category).filter(Boolean))],
  }), [cats.draft, list.draft, content, categoriesSection]);

  const errors = validate(schema, list.draft, section === 'posts' ? (p) => p.slug || slugify(p.title) : null);
  const shownErrors = useShownErrors(errors);
  const dirty = list.dirty || (categoriesSection && cats.dirty);
  const isCustom = customized.has(section) || (categoriesSection && customized.has(categoriesSection));

  const save = async () => {
    if (categoriesSection && cats.dirty) await cats.save();
    if (list.dirty) await list.save(finalize(schema, list.draft));
  };
  const revert = () => { list.revert(); if (categoriesSection) cats.revert(); };
  const reset = async () => {
    if (customized.has(section)) await list.reset();
    if (categoriesSection && customized.has(categoriesSection)) await cats.reset();
  };

  return (
    <>
      <PageHead title={schema.title} description={schema.description} />
      {categoriesSection && (
        <ChipsEditor label="Catégories (filtres de la page Portfolio)" values={cats.draft} onChange={cats.setDraft}
          used={list.draft.map((w) => w.category)} />
      )}
      <ListEditor schema={schema} items={list.draft} onChange={list.setDraft} options={options} errors={shownErrors.shown} />
      <SaveBar dirty={dirty} customized={isCustom} errors={errors} onSave={save} onRevert={revert} onReset={reset} onBlocked={shownErrors.onBlocked} />
    </>
  );
}

export function ServicesPage({ content, customized, onSaved, onDirty }) {
  const svc = useDraft('services', content.services, { onSaved, onDirty });
  const { categories = [], steps = [] } = svc.draft;
  const [tab, setTab] = useState(0);
  const cat = categories[tab];

  const setCategories = (next) => svc.setDraft({ ...svc.draft, categories: next });
  const setCat = (patch) => setCategories(categories.map((c, i) => (i === tab ? { ...c, ...patch } : c)));

  const addCategory = () => {
    setCategories([...categories, { id: `cat-${Date.now()}`, label: 'Nouvelle catégorie', services: [] }]);
    setTab(categories.length);
  };
  const removeCategory = () => {
    if (!window.confirm(`Supprimer l’onglet « ${cat.label} » et ses offres ?`)) return;
    setCategories(categories.filter((_, i) => i !== tab));
    setTab(0);
  };

  const errors = [
    ...validate(schemas.serviceStep, steps),
    ...categories.flatMap((c) => validate(schemas.serviceOffer, c.services || [])),
    ...categories.filter((c) => !c.label?.trim()).map(() => ({ index: -1, message: 'Un onglet n’a pas de nom' })),
  ];

  const shownErrors = useShownErrors(errors);
  const svcErrors = (list) => (shownErrors.shown.length ? validate(schemas.serviceOffer, list) : []);

  const save = () => svc.save({
    steps: finalize(schemas.serviceStep, steps),
    categories: categories.map((c) => ({ ...c, label: c.label.trim(), services: finalize(schemas.serviceOffer, c.services || []) })),
  });

  return (
    <>
      <PageHead title="Services" description="Les onglets de la section Services de l’accueil, leurs offres et tarifs en FCFA, et les 3 étapes affichées à côté." />

      <section className="adm-card">
        <h2 className="adm-card-title">Étapes</h2>
        <ListEditor schema={schemas.serviceStep} items={steps} onChange={(next) => svc.setDraft({ ...svc.draft, steps: next })}
          errors={shownErrors.shown.length ? validate(schemas.serviceStep, steps) : []} />
      </section>

      <section className="adm-card">
        <h2 className="adm-card-title">Offres par onglet</h2>
        <div className="adm-tabs" role="tablist">
          {categories.map((c, i) => (
            <button key={c.id} type="button" role="tab" aria-selected={i === tab} className={i === tab ? 'active' : ''} onClick={() => setTab(i)}>
              {c.label || 'Sans nom'}
            </button>
          ))}
          <button type="button" className="adm-tab-add" onClick={addCategory}><Plus size={14} /> Onglet</button>
        </div>
        {cat && (
          <>
            <div className="adm-inline-row">
              <label className="adm-field">
                <span className="adm-label">Nom de l’onglet</span>
                <input className="adm-input" value={cat.label} onChange={(e) => setCat({ label: e.target.value })} />
              </label>
              <button type="button" className="adm-btn adm-btn-ghost danger" onClick={removeCategory} disabled={categories.length <= 1}>
                Supprimer l’onglet
              </button>
            </div>
            <ListEditor key={cat.id} schema={schemas.serviceOffer} items={cat.services || []} onChange={(next) => setCat({ services: next })}
              errors={svcErrors(cat.services || [])} />
          </>
        )}
      </section>

      <SaveBar dirty={svc.dirty} customized={customized.has('services')} errors={errors}
        onSave={save} onRevert={svc.revert} onReset={svc.reset} onBlocked={shownErrors.onBlocked} />
    </>
  );
}
