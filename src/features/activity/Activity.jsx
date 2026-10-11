import { useMemo, useState } from 'react';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { ACTIVITY_PAGE_SIZE } from '../../data/constants.js';
import { actionsShape, stateShape } from '../../types.js';
import { formatINR } from '../../utils/format.js';

const KINDS = ['all', 'spend', 'bill', 'once', 'saving', 'surprise', 'income', 'plan'];
const KIND_TONE = { income: 'good', saving: 'good', bill: 'warn', surprise: 'bad' };

/** Filterable transaction log (newest first, paged) plus the month reset. */
export default function Activity({ state, actions }) {
  const [filter, setFilter] = useState('all');
  const [visible, setVisible] = useState(ACTIVITY_PAGE_SIZE);
  const [confirming, setConfirming] = useState(false);

  const rows = useMemo(
    () => state.transactions.filter((t) => filter === 'all' || t.kind === filter).reverse(),
    [state.transactions, filter],
  );
  const shown = rows.slice(0, visible);

  const changeFilter = (value) => {
    setFilter(value);
    setVisible(ACTIVITY_PAGE_SIZE);
  };

  const reset = () => {
    setConfirming(false);
    actions.reset();
  };

  return (
    <div className="stack">
      <header className="inline inline--between">
        <div>
          <h2 className="page-title">Activity</h2>
          <p className="muted">{state.transactions.length} entries this month</p>
        </div>
        <div className="field field--compact">
          <label htmlFor="kind-filter">Filter</label>
          <select id="kind-filter" className="input" value={filter} onChange={(e) => changeFilter(e.target.value)}>
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
      </header>

      <Card>
        {rows.length === 0 ? (
          <EmptyState
            icon="🧾"
            title="Nothing here yet"
            hint="Log a spend or move to the next day and it will show up."
          />
        ) : (
          <ul className="list list--long">
            {shown.map((t) => (
              <li key={t.id} className="list__item">
                <span>
                  {t.label}
                  <span className="muted"> · day {t.day} </span>
                  <Badge tone={KIND_TONE[t.kind]}>{t.kind}</Badge>
                </span>
                {t.amount > 0 && (
                  <strong className={t.kind === 'income' ? 'tone-good' : ''}>
                    {t.kind === 'income' ? '+' : '−'}
                    {formatINR(t.amount)}
                  </strong>
                )}
              </li>
            ))}
          </ul>
        )}
        {rows.length > shown.length && (
          <button type="button" className="btn" onClick={() => setVisible((n) => n + ACTIVITY_PAGE_SIZE)}>
            Show more ({rows.length - shown.length} older)
          </button>
        )}
      </Card>

      {confirming ? (
        <div className="confirm" role="alertdialog" aria-labelledby="reset-q">
          <p id="reset-q">
            <strong>Reset the whole month?</strong> This clears every entry and goal.
          </p>
          <div className="grid-2">
            <button type="button" className="btn" onClick={() => setConfirming(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn--danger" onClick={reset}>
              Yes, reset
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="btn btn--danger" onClick={() => setConfirming(true)}>
          Reset month
        </button>
      )}
    </div>
  );
}

Activity.propTypes = { state: stateShape.isRequired, actions: actionsShape.isRequired };
