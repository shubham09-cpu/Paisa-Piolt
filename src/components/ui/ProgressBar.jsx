import { clamp } from '../../lib/format.js';

/** Accessible progress bar (role="progressbar" with a readable label). */
export default function ProgressBar({ value, max, label, tone = 'brand' }) {
  const percent = clamp((value / max) * 100, 0, 100);
  return (
    <div
      className="bar"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={Math.round(max)}
      aria-valuenow={Math.round(value)}
    >
      <span className={`bar__fill bar__fill--${tone}`} style={{ width: `${percent}%` }} />
    </div>
  );
}
