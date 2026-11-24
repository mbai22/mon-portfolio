import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Copy, Plus, Search, Trash2 } from 'lucide-react';
import { Field } from './fields';

// Edits an array of objects described by a schema: list on the left, form on the right.
export default function ListEditor({ schema, items, onChange, options = {}, errors = [] }) {
  const [selected, setSelected] = useState(items.length ? 0 : -1);
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .map((item, index) => ({ item, index, view: schema.display(item) }))
      .filter(({ view }) => !q || `${view.title} ${view.subtitle}`.toLowerCase().includes(q));
  }, [items, query, schema]);

  const current = selected >= 0 ? items[selected] : null;
  const errorsAt = (index) => errors.filter((e) => e.index === index);

  const update = (name, value) => {
    onChange(items.map((item, i) => (i === selected ? { ...item, [name]: value } : item)));
  };

  const add = () => {
    onChange([schema.create(), ...items]);
    setSelected(0);
    setQuery('');
  };

  const duplicate = (index) => {
    const copy = { ...structuredClone(items[index]), ...pickIds(schema.create()) };
    if ('title' in copy) copy.title = `${copy.title} (copie)`;
    if ('slug' in copy) copy.slug = '';
    const next = [...items];
    next.splice(index + 1, 0, copy);
    onChange(next);
    setSelected(index + 1);
  };

  const remove = (index) => {
    const label = schema.display(items[index]).title || `ce ${schema.itemLabel}`;
    if (!window.confirm(`Supprimer « ${label} » ?\nLa suppression sera définitive après l’enregistrement.`)) return;
    onChange(items.filter((_, i) => i !== index));
    setSelected((s) => (s === index ? Math.min(index, items.length - 2) : s > index ? s - 1 : s));
  };

  const move = (index, dir) => {
    const to = index + dir;
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    [next[index], next[to]] = [next[to], next[index]];
    onChange(next);
    if (selected === index) setSelected(to);
    else if (selected === to) setSelected(index);
  };

  return (
    <div className="adm-list-editor">
      <div className="adm-list-pane">
        <div className="adm-list-tools">
          <button type="button" className="adm-btn adm-btn-primary" onClick={add}>
            <Plus size={16} /> Ajouter
          </button>
          {items.length > 6 && (
            <label className="adm-search">
              <Search size={15} aria-hidden="true" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher" aria-label="Rechercher" />
            </label>
          )}
        </div>

        {items.length === 0 && <p className="adm-empty">Aucun {schema.itemLabel} pour l’instant.</p>}

        <ol className="adm-items">
          {visible.map(({ index, view }) => (
            <li key={index} className={`adm-item${index === selected ? ' active' : ''}${errorsAt(index).length ? ' has-error' : ''}`}>
              <button type="button" className="adm-item-main" onClick={() => setSelected(index)}>
                {'image' in view && (
                  <span className={`adm-thumb${view.round ? ' round' : ''}`}>
                    {view.image ? <img src={view.image} alt="" loading="lazy" /> : null}
                  </span>
                )}
                <span className="adm-item-text">
                  <span className="adm-item-title">{view.title || <em>Sans titre</em>}</span>
                  {view.subtitle && <span className="adm-item-sub">{view.subtitle}</span>}
                </span>
              </button>
              <span className="adm-item-actions">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0 || !!query} aria-label="Monter"><ArrowUp size={15} /></button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1 || !!query} aria-label="Descendre"><ArrowDown size={15} /></button>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="adm-form-pane">
        {current ? (
          <form className="adm-form" onSubmit={(e) => e.preventDefault()} key={selected + ':' + items.length}>
            <div className="adm-form-head">
              <h3>{schema.display(current).title || `Nouveau ${schema.itemLabel}`}</h3>
              <div className="adm-form-head-actions">
                <button type="button" className="adm-icon-btn" onClick={() => duplicate(selected)} title="Dupliquer" aria-label="Dupliquer">
                  <Copy size={16} />
                </button>
                <button type="button" className="adm-icon-btn danger" onClick={() => remove(selected)} title="Supprimer" aria-label="Supprimer">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {errorsAt(selected).map((e) => <p key={e.message} className="adm-field-error">{e.message}</p>)}
            {schema.fields.map((field) => (
              <Field key={field.name} field={field} item={current} onChange={update} options={options} />
            ))}
          </form>
        ) : (
          <p className="adm-empty">Sélectionnez un élément à modifier ou ajoutez-en un.</p>
        )}
      </div>
    </div>
  );
}

// Fresh ids for a duplicated item (keeps everything else)
function pickIds(fresh) {
  return 'id' in fresh ? { id: fresh.id } : {};
}
