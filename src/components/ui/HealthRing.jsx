import { memo } from 'react';
import PropTypes from 'prop-types';
import { toneType } from '../../types.js';

const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Circular 0-100 score with the number in the middle. */
function HealthRing({ score, tone }) {
  return (
    <svg width="92" height="92" viewBox="0 0 92 92" role="img" aria-label={`Health score ${score} out of 100`}>
      <circle cx="46" cy="46" r={RADIUS} className="ring__track" />
      <circle
        cx="46"
        cy="46"
        r={RADIUS}
        className={`ring__value ring__value--${tone}`}
        strokeDasharray={`${(CIRCUMFERENCE * score) / 100} ${CIRCUMFERENCE}`}
        transform="rotate(-90 46 46)"
      />
      <text x="46" y="53" textAnchor="middle" className="ring__text">
        {score}
      </text>
    </svg>
  );
}

HealthRing.propTypes = { score: PropTypes.number.isRequired, tone: toneType.isRequired };

export default memo(HealthRing);
