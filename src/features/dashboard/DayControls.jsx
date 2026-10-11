import { memo } from 'react';
import { TOTAL_DAYS } from '../../data/constants.js';
import PropTypes from 'prop-types';

/** Time-travel buttons (+1 / +7 days) and the surprise-expense trigger. */
function DayControls({ day, onAdvance, onSurprise }) {
  const finished = day >= TOTAL_DAYS;
  return (
    <div className="grid-2">
      <button type="button" className="btn btn--primary" disabled={finished} onClick={() => onAdvance(1)}>
        Next day ▶
      </button>
      <button type="button" className="btn" disabled={finished} onClick={() => onAdvance(7)}>
        +7 days ⏩
      </button>
      <button type="button" className="btn btn--wide" onClick={onSurprise}>
        🎲 Surprise expense
      </button>
    </div>
  );
}

DayControls.propTypes = {
  day: PropTypes.number.isRequired,
  onAdvance: PropTypes.func.isRequired,
  onSurprise: PropTypes.func.isRequired,
};

export default memo(DayControls);
