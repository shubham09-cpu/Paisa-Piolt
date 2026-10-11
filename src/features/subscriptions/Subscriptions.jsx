import Card from '../../components/ui/Card.jsx';
import Switch from '../../components/ui/Switch.jsx';
import { formatINR } from '../../utils/format.js';
import { actionsShape, metricsShape, stateShape } from '../../types.js';

/** Fixed commitments plus subscription switches; toggling one updates every metric. */
export default function Subscriptions({ state, metrics, actions }) {
  return (
    <div className="stack">
      <header>
        <h2 className="page-title">Bills &amp; subscriptions</h2>
        <p className="muted">Switch a subscription off and watch your allowance, risk and health update.</p>
      </header>

      <div className="split">
        <Card title="Commitments" subtitle="Fixed bills for this month">
          <ul className="list">
            {state.commitments.map((c) => (
              <li key={c.id} className="list__item">
                <span>
                  {c.label}{' '}
                  <span className="muted">
                    · day {c.day}
                    {c.day <= state.day ? ' · paid ✓' : ''}
                  </span>
                </span>
                <strong>{formatINR(c.amount)}</strong>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Subscriptions"
          subtitle={`${formatINR(metrics.subscriptionLoad)}/month · ${formatINR(metrics.subscriptionLoad * 12)}/year`}
        >
          <ul className="list">
            {state.subscriptions.map((s) => (
              <li key={s.id} className="list__item">
                <span>
                  {s.label}
                  <span className="muted">
                    {' '}
                    · {formatINR(s.amount)} · day {s.day}
                    {s.active && s.day <= state.day ? ' · paid ✓' : ''}
                  </span>
                </span>
                <Switch
                  checked={s.active}
                  label={`${s.label} subscription`}
                  onChange={() => actions.toggleSubscription(s.id)}
                />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

Subscriptions.propTypes = {
  state: stateShape.isRequired,
  metrics: metricsShape.isRequired,
  actions: actionsShape.isRequired,
};
