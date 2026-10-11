import { memo, useState } from 'react';
import AmountForm from '../../components/ui/AmountForm.jsx';
import Card from '../../components/ui/Card.jsx';
import { SPEND_CATEGORIES } from '../../data/constants.js';
import PropTypes from 'prop-types';

/** Log an everyday spend; these feed the spending-pace forecast. */
function QuickLog({ onLog }) {
  const [category, setCategory] = useState(SPEND_CATEGORIES[0]);

  return (
    <Card title="Log a spend">
      <div className="chips" role="group" aria-label="Category">
        {SPEND_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`chip ${c === category ? 'is-on' : ''}`}
            aria-pressed={c === category}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <AmountForm
        id="spend-amount"
        label="Spend amount in rupees"
        submitLabel="Add"
        primary
        onSubmit={(amount) => onLog(amount, category)}
      />
    </Card>
  );
}

QuickLog.propTypes = { onLog: PropTypes.func.isRequired };

export default memo(QuickLog);
