import { memo } from 'react';
import { TOTAL_DAYS, STARTING_BUDGET } from '../../data/constants.js';
import { formatINR } from '../../lib/format.js';

const W = 340;
const H = 120;
const PAD = 10;

/** Actual balance line + dashed projection to day 30. */
function ForecastChart({ history, day, balance, forecast }) {
  const low = Math.min(0, forecast);
  const x = (d) => PAD + ((d - 1) / (TOTAL_DAYS - 1)) * (W - PAD * 2);
  const y = (v) => H - PAD - ((v - low) / (STARTING_BUDGET - low)) * (H - PAD * 2);
  const actual = history.map((v, i) => `${x(i + 1)},${y(v)}`).join(' ');
  const bad = forecast < 0;

  return (
    <figure className="chart">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Balance is ${formatINR(balance)} on day ${day}. Projected balance on day 30 is ${formatINR(forecast)}.`}
      >
        <line x1={PAD} x2={W - PAD} y1={y(0)} y2={y(0)} className="chart__zero" />
        <polyline points={actual} className="chart__actual" />
        <line x1={x(day)} y1={y(balance)} x2={x(TOTAL_DAYS)} y2={y(forecast)} className={`chart__proj ${bad ? 'is-bad' : ''}`} />
        <circle cx={x(TOTAL_DAYS)} cy={y(forecast)} r="4.5" className={`chart__dot ${bad ? 'is-bad' : ''}`} />
      </svg>
      <figcaption className="muted">Solid: actual balance · dashed: projection to day 30</figcaption>
    </figure>
  );
}

export default memo(ForecastChart);
