import { memo } from 'react';
import PropTypes from 'prop-types';
import { toneType } from '../../types.js';
import { clamp } from '../../utils/format.js';

/** Accessible progress bar (role="progressbar" with a readable label). */
function ProgressBar({ value, max, label, tone = 'brand' }) {
  const percent = max > 0 ? clamp((value / max) * 100, 0, 100) : 0;
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

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  tone: toneType,
};

export default memo(ProgressBar);
