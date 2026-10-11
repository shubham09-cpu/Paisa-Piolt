import { memo } from 'react';
import Card from '../../components/ui/Card.jsx';
import { buildCoachTip } from '../../lib/finance.js';
import { metricsShape } from '../../types.js';

function CoachTip({ metrics }) {
  const tip = buildCoachTip(metrics);
  return (
    <Card tone={tip.tone}>
      <p className="coach" role="status" aria-live="polite">
        <span aria-hidden="true">{tip.icon}</span> <strong>Coach</strong>
        <span className="coach__text">{tip.text}</span>
      </p>
    </Card>
  );
}

CoachTip.propTypes = { metrics: metricsShape.isRequired };

export default memo(CoachTip);
