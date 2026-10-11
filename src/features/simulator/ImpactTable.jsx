import { formatINR } from '../../utils/format.js';
import PropTypes from 'prop-types';

/** Before/after rows. `lowerIsBetter` flips the good/bad colouring (e.g. risk). */
function Row({ label, before, after, format = (v) => v, lowerIsBetter = false }) {
  const delta = after - before;
  const tone = Math.abs(delta) < 0.5 ? '' : delta > 0 !== lowerIsBetter ? 'tone-good' : 'tone-bad';
  return (
    <tr>
      <th scope="row">{label}</th>
      <td>{format(before)}</td>
      <td className={tone}>
        <strong>{format(after)}</strong>
      </td>
    </tr>
  );
}

/** Accessible table comparing metrics before and after a simulated decision. */
export default function ImpactTable({ result }) {
  const { before, after, balanceBefore, balanceAfter } = result;
  return (
    <div className="table-wrap">
      <table className="table">
        <caption className="sr-only">Impact of this decision</caption>
        <thead>
          <tr>
            <th scope="col">Impact</th>
            <th scope="col">Now</th>
            <th scope="col">After</th>
          </tr>
        </thead>
        <tbody>
          <Row label="Balance" before={balanceBefore} after={balanceAfter} format={formatINR} />
          <Row label="Daily allowance" before={before.dailyAllowance} after={after.dailyAllowance} format={formatINR} />
          <Row label="Month-end forecast" before={before.forecast} after={after.forecast} format={formatINR} />
          <Row label="Spare cash for goals" before={before.goalSurplus} after={after.goalSurplus} format={formatINR} />
          <Row label="Risk" before={before.risk} after={after.risk} lowerIsBetter />
          <Row label="Health" before={before.health} after={after.health} />
        </tbody>
      </table>
    </div>
  );
}

const metricPair = PropTypes.shape({
  dailyAllowance: PropTypes.number.isRequired,
  forecast: PropTypes.number.isRequired,
  goalSurplus: PropTypes.number.isRequired,
  risk: PropTypes.number.isRequired,
  health: PropTypes.number.isRequired,
});

Row.propTypes = {
  label: PropTypes.string.isRequired,
  before: PropTypes.number.isRequired,
  after: PropTypes.number.isRequired,
  format: PropTypes.func,
  lowerIsBetter: PropTypes.bool,
};

ImpactTable.propTypes = {
  result: PropTypes.shape({
    before: metricPair.isRequired,
    after: metricPair.isRequired,
    balanceBefore: PropTypes.number.isRequired,
    balanceAfter: PropTypes.number.isRequired,
  }).isRequired,
};
