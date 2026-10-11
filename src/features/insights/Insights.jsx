import Card from '../../components/ui/Card.jsx';
import HealthRing from '../../components/ui/HealthRing.jsx';
import ProgressBar from '../../components/ui/ProgressBar.jsx';
import { healthLevel, riskLevel } from '../../lib/finance.js';
import { formatINR } from '../../utils/format.js';
import { metricsShape, stateShape } from '../../types.js';

/** Explains *why* the risk and health numbers are what they are. */
export default function Insights({ state, metrics }) {
  const risk = riskLevel(metrics.risk);
  const health = healthLevel(metrics.health);
  const weakest = [...metrics.healthParts].sort((a, b) => a.points / a.max - b.points / b.max)[0];

  const drivers = [
    {
      label: 'Cash cover',
      value: `${metrics.cover.toFixed(2)}×`,
      hint: 'Free cash ÷ projected spend. Above 1.5× is comfortable.',
    },
    {
      label: 'Bills still ahead',
      value: formatINR(metrics.upcomingBills),
      hint: 'Already reserved before your daily allowance.',
    },
    {
      label: 'Everyday spend pace',
      value: `${formatINR(metrics.avgDaily)}/day`,
      hint: 'Smoothed from what you have logged so far.',
    },
    {
      label: 'Subscription load',
      value: `${formatINR(metrics.subscriptionLoad)}/mo`,
      hint: 'Recurring costs that never go away on their own.',
    },
  ];

  return (
    <div className="stack">
      <header>
        <h2 className="page-title">Risk &amp; health</h2>
        <p className="muted">Every score is built from the same live numbers you see on Home.</p>
      </header>

      <div className="split">
        <Card title="Financial health" aside={<HealthRing score={metrics.health} tone={health.tone} />}>
          <p className={`tone-${health.tone}`}>
            <strong>{health.label}</strong>
          </p>
          <ul className="list">
            {metrics.healthParts.map((part) => (
              <li key={part.id} className="list__item list__item--col">
                <div className="inline inline--between">
                  <span>{part.label}</span>
                  <span className="muted">
                    {Math.round(part.points)} / {part.max}
                  </span>
                </div>
                <ProgressBar value={part.points} max={part.max} label={part.label} />
              </li>
            ))}
          </ul>
          <p className="muted">
            Biggest opportunity: <strong>{weakest.label.toLowerCase()}</strong>.
          </p>
        </Card>

        <Card title="Financial risk" tone={risk.tone}>
          <p className={`score__label tone-${risk.tone}`}>
            {risk.label} · {metrics.risk}/100
          </p>
          <ProgressBar value={metrics.risk} max={100} label="Risk score" tone={risk.tone} />
          <ul className="list">
            {drivers.map((d) => (
              <li key={d.label} className="list__item list__item--col">
                <div className="inline inline--between">
                  <span>{d.label}</span>
                  <strong>{d.value}</strong>
                </div>
                <span className="muted">{d.hint}</span>
              </li>
            ))}
          </ul>
          <p className="muted">
            Day {state.day}: {metrics.daysLeft} days left to stretch {formatINR(metrics.freeCash)} of free cash.
          </p>
        </Card>
      </div>
    </div>
  );
}

Insights.propTypes = { state: stateShape.isRequired, metrics: metricsShape.isRequired };
