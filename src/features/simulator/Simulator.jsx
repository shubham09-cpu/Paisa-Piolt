import { useDeferredValue, useMemo, useState } from 'react';
import Card from '../../components/ui/Card.jsx';
import { DECISION_TYPES } from '../../data/constants.js';
import { compareDecision } from '../../lib/finance.js';
import { formatINR } from '../../utils/format.js';
import ImpactTable from './ImpactTable.jsx';
import PropTypes from 'prop-types';
import { actionsShape, stateShape } from '../../types.js';

/** Preview a decision against the live state; nothing changes until "Commit". */
export default function Simulator({ state, actions, onDone }) {
  const [type, setType] = useState('once');
  const [amount, setAmount] = useState(1500);
  const [goalId, setGoalId] = useState(state.goals[1]?.id ?? state.goals[0].id);

  // Deferred so dragging the slider stays smooth while the comparison recalculates.
  const deferredAmount = useDeferredValue(amount);
  const decision = useMemo(() => ({ type, amount: deferredAmount, goalId }), [type, deferredAmount, goalId]);
  const result = useMemo(() => compareDecision(state, decision), [state, decision]);
  const goal = state.goals.find((g) => g.id === goalId);
  const unit = DECISION_TYPES[type].unit;

  const commit = () => {
    actions.commitDecision(decision);
    onDone();
  };

  return (
    <div className="stack">
      <header>
        <h2 className="page-title">Decision simulator</h2>
        <p className="muted">Test a move first. Nothing changes until you commit.</p>
      </header>

      <div className="split">
        <Card title="Your decision">
          <div className="chips" role="group" aria-label="Decision type">
            {Object.entries(DECISION_TYPES).map(([id, t]) => (
              <button
                key={id}
                type="button"
                className={`chip ${id === type ? 'is-on' : ''}`}
                aria-pressed={id === type}
                onClick={() => setType(id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {type === 'goal' && (
            <div className="field">
              <label htmlFor="sim-goal">Goal</label>
              <select id="sim-goal" className="input" value={goalId} onChange={(e) => setGoalId(e.target.value)}>
                {state.goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.icon} {g.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="field">
            <div className="inline inline--between">
              <label htmlFor="sim-amount">Amount</label>
              <output className="amount-out" htmlFor="sim-amount">
                {formatINR(amount)}
                {unit}
              </output>
            </div>
            <input
              id="sim-amount"
              type="range"
              min="50"
              max="5000"
              step="50"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          {type === 'subscription' && <p className="muted">That&apos;s {formatINR(amount * 12)} a year.</p>}
          {type === 'goal' && goal && (
            <p className="muted">
              {goal.icon} {goal.label}: {Math.round((goal.saved / goal.target) * 100)}% →{' '}
              <strong>{Math.min(100, Math.round(((goal.saved + amount) / goal.target) * 100))}%</strong>
            </p>
          )}
        </Card>

        <Card title="What happens next">
          <ImpactTable result={result} />
          <p className={`verdict verdict--${result.verdict.tone}`} role="status">
            {result.verdict.text}
          </p>
          <div className="grid-2">
            <button type="button" className="btn" onClick={onDone}>
              Skip it
            </button>
            <button type="button" className="btn btn--primary" onClick={commit}>
              Commit
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

Simulator.propTypes = {
  state: stateShape.isRequired,
  actions: actionsShape.isRequired,
  onDone: PropTypes.func.isRequired,
};
