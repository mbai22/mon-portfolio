// Draft state and save helpers shared by the admin pages
import { useEffect, useState } from 'react';
import { slugify, youtubeId } from './schemas';
import { resetSection, saveSection } from './api';
import { defaultContent } from '../content/defaults';

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Local draft of one content section + save / revert / reset helpers
export function useDraft(section, value, { onSaved, onDirty }) {
  const [draft, setDraft] = useState(value);
  const [saved, setSaved] = useState(value);
  const dirty = !same(draft, saved);

  useEffect(() => { onDirty(section, dirty); }, [section, dirty, onDirty]);
  useEffect(() => () => onDirty(section, false), [section, onDirty]);

  return {
    draft,
    setDraft,
    dirty,
    revert: () => setDraft(saved),
    async save(data = draft) {
      await saveSection(section, data);
      setDraft(data);
      setSaved(data);
      onSaved(section, data);
    },
    async reset() {
      await resetSection(section);
      const original = defaultContent[section];
      setDraft(original);
      setSaved(original);
      onSaved(section, original, true);
    },
  };
}

// Fill automatic values before saving (blog slug from title, YouTube id from a link)
export function finalize(schema, items) {
  return items.map((item) => {
    const out = { ...item };
    for (const field of schema.fields) {
      if (field.type === 'slug' && !out[field.name]) out[field.name] = slugify(out[field.from]);
      if (field.type === 'youtube' && out[field.name]) out[field.name] = youtubeId(out[field.name]);
      if (field.type === 'lines' && Array.isArray(out[field.name])) out[field.name] = out[field.name].map((l) => l.trim()).filter(Boolean);
    }
    for (const key of Object.keys(out)) if (out[key] === '' && !schema.fields.some((f) => f.name === key && f.required)) delete out[key];
    return out;
  });
}

// Errors are only shown once the user tried to save
export function useShownErrors(errors) {
  const [attempted, setAttempted] = useState(false);
  return { shown: attempted ? errors : [], onBlocked: () => setAttempted(true), reset: () => setAttempted(false) };
}

