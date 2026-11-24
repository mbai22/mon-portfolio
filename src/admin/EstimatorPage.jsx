import { useMemo } from 'react';
import ListEditor from './ListEditor';
import { Field } from './fields';
import { estimatorSchemas, validate } from './schemas';
import { PageHead, SaveBar } from './pages';
import { finalize, useDraft, useShownErrors } from './draft';

const settingsFields = [
  { name: 'intro', label: 'Texte d’introduction', type: 'textarea', rows: 3 },
  { name: 'spread', label: 'Largeur de la fourchette', type: 'number', min: 0, max: 1, step: 0.05, help: '0,2 = la page affiche « de X à X + 20 % ».' },
];

export default function EstimatorPage({ content, customized, onSaved, onDirty }) {
  const est = useDraft('estimator', content.estimator, { onSaved, onDirty });
  const { projectTypes = [], options = [], delays = [] } = est.draft;
  const set = (key, value) => est.setDraft({ ...est.draft, [key]: value });

  const choices = useMemo(() => ({
    projectTypeChoices: projectTypes.map((t) => ({ value: t.id, label: t.label || 'Sans nom' })),
  }), [projectTypes]);

  const errors = [
    ...validate(estimatorSchemas.type, projectTypes),
    ...validate(estimatorSchemas.option, options),
    ...validate(estimatorSchemas.delay, delays),
    ...(projectTypes.length ? [] : [{ index: -1, message: 'Il faut au moins un type de projet' }]),
  ];
  const shown = useShownErrors(errors);
  const err = (schema, list) => (shown.shown.length ? validate(schema, list) : []);

  const save = () => est.save({
    ...est.draft,
    spread: Number(est.draft.spread) || 0,
    projectTypes: finalize(estimatorSchemas.type, projectTypes),
    // drop links to project types that were deleted
    options: finalize(estimatorSchemas.option, options).map((o) => ({ ...o, types: (o.types || []).filter((id) => projectTypes.some((t) => t.id === id)) })),
    delays: finalize(estimatorSchemas.delay, delays),
  });

  return (
    <>
      <PageHead title="Estimateur de devis" description="Les prix utilisés par la page /devis. Le visiteur obtient une fourchette indicative puis vous envoie le détail sur WhatsApp.">
        <a className="adm-link" href="/devis" target="_blank" rel="noreferrer">Voir la page</a>
      </PageHead>

      <section className="adm-card">
        <h2 className="adm-card-title">Réglages</h2>
        {settingsFields.map((f) => (
          <Field key={f.name} field={f} item={est.draft} onChange={set} options={{}} />
        ))}
      </section>

      <section className="adm-card">
        <h2 className="adm-card-title">Types de projet</h2>
        <ListEditor schema={estimatorSchemas.type} items={projectTypes} onChange={(v) => set('projectTypes', v)} errors={err(estimatorSchemas.type, projectTypes)} />
      </section>

      <section className="adm-card">
        <h2 className="adm-card-title">Options</h2>
        <ListEditor schema={estimatorSchemas.option} items={options} onChange={(v) => set('options', v)} options={choices} errors={err(estimatorSchemas.option, options)} />
      </section>

      <section className="adm-card">
        <h2 className="adm-card-title">Délais</h2>
        <ListEditor schema={estimatorSchemas.delay} items={delays} onChange={(v) => set('delays', v)} errors={err(estimatorSchemas.delay, delays)} />
      </section>

      <SaveBar dirty={est.dirty} customized={customized.has('estimator')} errors={errors}
        onSave={save} onRevert={est.revert} onReset={est.reset} onBlocked={shown.onBlocked} />
    </>
  );
}
