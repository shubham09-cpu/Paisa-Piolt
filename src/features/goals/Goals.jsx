import AmountForm from '../../components/ui/AmountForm.jsx';
import Card from '../../components/ui/Card.jsx';
import ProgressBar from '../../components/ui/ProgressBar.jsx';
import { formatINR } from '../../utils/format.js';
import PropTypes from 'prop-types';
import { actionsShape, goalShape, metricsShape, stateShape } from '../../types.js';

function GoalCard({ goal, onSave }) {
  const done = goal.saved >= goal.target;

  return (
    <Card
      title={`${goal.icon} ${goal.label}`}
      aside={
        <span className="muted">
          {formatINR(goal.saved)} / {formatINR(goal.target)}
        </span>
      }
    >
      <ProgressBar
        value={goal.saved}
        max={goal.target}
        label={`${goal.label} progress`}
        tone={done ? 'good' : 'brand'}
      />
      {done && <p className="tone-good">Goal reached 🎉</p>}
      <div className="chips">
        <button type="button" className="chip" onClick={() => onSave(goal.id, 100)}>
          +₹100
        </button>
        <button type="button" className="chip" onClick={() => onSave(goal.id, 500)}>
          +₹500
        </button>
      </div>
      <AmountForm
        id={`custom-${goal.id}`}
        label={`Custom amount for ${goal.label}`}
        placeholder="Custom ₹"
        submitLabel="Save"
        onSubmit={(amount) => onSave(goal.id, amount)}
      />
    </Card>
  );
}

export default function Goals({ state, metrics, actions }) {
  return (
    <div className="stack">
      <header>
        <h2 className="page-title">Savings goals</h2>
        <p className="muted">
          Saved so far {formatINR(metrics.totalSaved)} · projected spare cash this month{' '}
          {formatINR(metrics.goalSurplus)}
        </p>
      </header>
      <div className="cards-3">
        {state.goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onSave={actions.saveToGoal} />
        ))}
      </div>
    </div>
  );
}

GoalCard.propTypes = { goal: goalShape.isRequired, onSave: PropTypes.func.isRequired };

Goals.propTypes = { state: stateShape.isRequired, metrics: metricsShape.isRequired, actions: actionsShape.isRequired };
