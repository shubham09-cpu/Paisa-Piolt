import { memo } from 'react';
import Card from '../../components/ui/Card.jsx';
import HealthRing from '../../components/ui/HealthRing.jsx';
import { healthLevel, riskLevel } from '../../lib/finance.js';

function ScoreCard({ metrics }) {
  const health = healthLevel(metrics.health);
  const risk = riskLevel(metrics.risk);
  return (
    <Card className="score">
      <div className="score__row">
        <div>
          <p className="muted">Financial health</p>
          <p className={`score__label tone-${health.tone}`}>{health.label}</p>
          <p className="muted">
            Risk: <strong className={`tone-${risk.tone}`}>{risk.label} ({metrics.risk})</strong>
          </p>
        </div>
        <HealthRing score={metrics.health} tone={health.tone} />
      </div>
    </Card>
  );
}

export default memo(ScoreCard);
