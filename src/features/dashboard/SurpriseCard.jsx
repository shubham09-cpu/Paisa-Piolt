import Card from '../../components/ui/Card.jsx';
import { EMERGENCY_GOAL_ID } from '../../data/constants.js';
import { applyDecision, computeMetrics } from '../../lib/finance.js';
import { formatINR } from '../../lib/format.js';

/** Unexpected expense with a live preview of how paying for it changes your numbers. */
export default function SurpriseCard({ state, metrics, onResolve }) {
  const surprise = state.pendingSurprise;
  if (!surprise) return null;

  const fund = state.goals.find((g) => g.id === EMERGENCY_GOAL_ID);
  const after = computeMetrics(applyDecision(state, { type: 'once', amount: surprise.amount }));

  return (
    <Card tone="warn" title={`⚡ ${surprise.label}: ${formatINR(surprise.amount)}`}>
      <p className="muted">
        Paying from balance: daily allowance {formatINR(metrics.dailyAllowance)} → <strong>{formatINR(after.dailyAllowance)}</strong>, risk {metrics.risk} → <strong>{after.risk}</strong>.
      </p>
      <div className="grid-2">
        <button type="button" className="btn btn--primary" onClick={() => onResolve(false)}>Pay from balance</button>
        <button type="button" className="btn" disabled={!fund || fund.saved <= 0} onClick={() => onResolve(true)}>
          Use emergency fund ({formatINR(fund ? fund.saved : 0)})
        </button>
      </div>
    </Card>
  );
}
