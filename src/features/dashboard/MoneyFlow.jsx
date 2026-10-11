import { memo } from 'react';
import Card from '../../components/ui/Card.jsx';
import ProgressBar from '../../components/ui/ProgressBar.jsx';
import { formatINR } from '../../utils/format.js';
import PropTypes from 'prop-types';

/** Connects income to everything it has been spent on so far. */
function MoneyFlow({ flow, balance }) {
  const rows = [
    { label: 'Bills & subscriptions paid', value: flow.bills },
    { label: 'Everyday spending', value: flow.everyday },
    { label: 'One-offs & surprises', value: flow.oneOff },
    { label: 'Moved to savings', value: flow.saved, tone: 'good' },
  ];
  return (
    <Card title="Where your income went" aside={<strong>{formatINR(flow.income)} in</strong>}>
      <ul className="list">
        {rows.map((row) => (
          <li key={row.label} className="list__item list__item--col">
            <div className="inline inline--between">
              <span>{row.label}</span>
              <strong>{formatINR(row.value)}</strong>
            </div>
            <ProgressBar value={row.value} max={flow.income} label={row.label} tone={row.tone} />
          </li>
        ))}
      </ul>
      <p className="muted">
        Left in balance: <strong>{formatINR(balance)}</strong>
      </p>
    </Card>
  );
}

MoneyFlow.propTypes = {
  flow: PropTypes.shape({
    income: PropTypes.number.isRequired,
    bills: PropTypes.number.isRequired,
    everyday: PropTypes.number.isRequired,
    oneOff: PropTypes.number.isRequired,
    saved: PropTypes.number.isRequired,
  }).isRequired,
  balance: PropTypes.number.isRequired,
};

export default memo(MoneyFlow);
