import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { adminGet } from './api';

const EVENT_LABELS = {
  whatsapp: 'Clics WhatsApp',
  email: 'Clics e-mail',
  contact_form: 'Formulaires de contact',
  devis: 'Estimations envoyées',
  booking: 'Rendez-vous réservés',
  audit: 'Audits lancés',
  chat: 'Conversations assistant',
  client_space: 'Visites espace client',
};

const nf = new Intl.NumberFormat('fr-FR');
const shortDate = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

function BarChart({ daily }) {
  const [hover, setHover] = useState(null);
  const max = Math.max(1, ...daily.map((d) => d.views));
  // Round the axis top to a readable value
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const top = Math.ceil(max / step) * step;
  const W = 720, H = 200, padL = 36, padB = 24, padT = 8;
  const plotW = W - padL, plotH = H - padB - padT;
  const bw = plotW / daily.length;
  const barW = Math.max(2, bw - 2);
  const y = (v) => padT + plotH - (v / top) * plotH;
  const labelEvery = Math.ceil(daily.length / 8);

  return (
    <div className="adm-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Visites par jour">
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line x1={padL} x2={W} y1={y(top * f)} y2={y(top * f)} className="adm-chart-grid" />
            <text x={padL - 6} y={y(top * f) + 4} textAnchor="end" className="adm-chart-axis">{nf.format(top * f)}</text>
          </g>
        ))}
        {daily.map((d, i) => {
          const x = padL + i * bw + 1;
          const h = Math.max(d.views ? 2 : 0, (d.views / top) * plotH);
          const r = Math.min(4, barW / 2, h);
          return (
            <g key={d.date} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              {/* Hit target taller than the bar */}
              <rect x={padL + i * bw} y={padT} width={bw} height={plotH} fill="transparent" />
              {h > 0 && (
                <path
                  className={`adm-chart-bar${hover === i ? ' on' : ''}`}
                  d={`M${x},${y(0)} v${-(h - r)} q0,${-r} ${r},${-r} h${barW - 2 * r} q${r},0 ${r},${r} v${h - r} z`}
                />
              )}
              {i % labelEvery === 0 && (
                <text x={x + barW / 2} y={H - 6} textAnchor="middle" className="adm-chart-axis">{shortDate(d.date)}</text>
              )}
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div className="adm-chart-tip" style={{ left: `${((padL + hover * bw + bw / 2) / W) * 100}%` }}>
          <strong>{nf.format(daily[hover].views)}</strong> visite{daily[hover].views > 1 ? 's' : ''}
          <span>{shortDate(daily[hover].date)}</span>
        </div>
      )}
    </div>
  );
}

function Ranking({ title, rows, empty }) {
  const entries = Object.entries(rows || {});
  return (
    <section className="adm-card">
      <h2 className="adm-card-title">{title}</h2>
      {entries.length ? (
        <table className="adm-table">
          <tbody>
            {entries.map(([k, v]) => (
              <tr key={k}><td>{k}</td><td className="num">{nf.format(v)}</td></tr>
            ))}
          </tbody>
        </table>
      ) : <p className="adm-empty">{empty}</p>}
    </section>
  );
}

export default function StatsPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    adminGet(`/api/track.php?days=${days}`)
      .then((d) => { if (!cancelled) { setData(d); setError(''); } })
      .catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [days]);

  const events = useMemo(
    () => Object.fromEntries(Object.entries(data?.events || {}).map(([k, v]) => [EVENT_LABELS[k] || k, v])),
    [data],
  );

  const total = data?.totalViews ?? 0;
  const contacts = data ? ['whatsapp', 'email', 'contact_form', 'devis', 'booking'].reduce((n, k) => n + (data.events?.[k] || 0), 0) : 0;
  const mobileShare = data && total ? Math.round((data.devices.mobile / Math.max(1, data.devices.mobile + data.devices.desktop)) * 100) : 0;

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1>Statistiques</h1>
          <p>Visites du site, sans cookie ni donnée personnelle. Vos propres visites (connecté à l’admin) et les robots ne sont pas comptés.</p>
        </div>
        <div className="adm-tabs" role="tablist" aria-label="Période">
          {[7, 30, 90].map((d) => (
            <button key={d} type="button" role="tab" aria-selected={days === d} className={days === d ? 'active' : ''} onClick={() => setDays(d)}>
              {d} jours
            </button>
          ))}
        </div>
      </header>

      {error && <p className="adm-field-error">{error}</p>}
      {!data && !error && <div className="adm-empty"><Loader2 size={18} className="adm-spin" /></div>}

      {data && (
        <>
          <div className="adm-stats">
            <div className="adm-stat static"><span className="adm-stat-count">{nf.format(total)}</span><span className="adm-stat-label">Pages vues</span></div>
            <div className="adm-stat static"><span className="adm-stat-count">{nf.format(Math.round(total / data.days))}</span><span className="adm-stat-label">Par jour en moyenne</span></div>
            <div className="adm-stat static"><span className="adm-stat-count">{nf.format(contacts)}</span><span className="adm-stat-label">Prises de contact</span></div>
            <div className="adm-stat static"><span className="adm-stat-count">{mobileShare} %</span><span className="adm-stat-label">Sur mobile</span></div>
          </div>

          <section className="adm-card">
            <h2 className="adm-card-title">Pages vues par jour</h2>
            <BarChart daily={data.daily} />
          </section>

          <div className="adm-grid-2">
            <Ranking title="Pages les plus vues" rows={data.paths} empty="Pas encore de visite." />
            <Ranking title="Actions des visiteurs" rows={events} empty="Aucune action pour l’instant." />
            <Ranking title="Provenance" rows={data.refs} empty="Visites directes uniquement pour l’instant." />
          </div>
        </>
      )}
    </>
  );
}
