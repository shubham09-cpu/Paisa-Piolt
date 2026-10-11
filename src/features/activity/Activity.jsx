import { useState } from 'react';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import { formatINR } from '../../lib/format.js';

const KINDS = ['all', 'spend', 'bill', 'once', 'saving', 'surprise', 'income', 'plan'];
const KIND_TONE = { income: 'good', saving: 'good', bill: 'warn', surprise: 'bad' };

export default function Activity({ state, actions }) {
  const [filter, setFilter] = useState('all');
  const rows = state.transactions.filter((t) => filter === 'all' || t.kind === filter).slice().reverse();

  return (
    <div className="stack">
      <header className="inline inline--between">
        <div>
          <h2 className="page-title">Activity</h2>
          <p className="muted">{state.transactions.length} entries this month</p>
        </div>
        <div className="field field--compact">
          <label htmlFor="kind-filter">Filter</label>
          <select id="kind-filter" className="input" value={filter} onChange={(e) => setFilter(e.target.value)}>
            {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      </header>

      <Card>
        {rows.length === 0 ? (
          <p className="muted">Nothing here yet. Log a spend or move to the next day.</p>
        ) : (
          <ul className="list">
            {rows.map((t) => (
              <li key={t.id} className="list__item">
                <span>
                  {t.label}
                  <span className="muted"> · day {t.day} </span>
                  <Badge tone={KIND_TONE[t.kind]}>{t.kind}</Badge>
                </span>
                {t.amount > 0 && (
                  <strong className={t.kind === 'income' ? 'tone-good' : ''}>
                    {t.kind === 'income' ? '+' : '−'}{formatINR(t.amount)}
                  </strong>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <button type="button" className="btn btn--danger" onClick={() => { if (window.confirm('Reset the whole month?')) actions.reset(); }}>
        Reset month
      </button>
    </div>
  );
}
