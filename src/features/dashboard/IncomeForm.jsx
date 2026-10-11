import { memo, useState } from 'react';
import AmountForm from '../../components/ui/AmountForm.jsx';
import Card from '../../components/ui/Card.jsx';
import { INCOME_SOURCES } from '../../data/constants.js';

/** Record extra income (gig work, pocket money…). It raises balance, allowance and forecast. */
function IncomeForm({ onAdd }) {
  const [source, setSource] = useState(INCOME_SOURCES[0]);
  return (
    <Card title="Add income" subtitle="Extra money lifts your balance, allowance and forecast.">
      <div className="field">
        <label htmlFor="income-source">Source</label>
        <select id="income-source" className="input" value={source} onChange={(e) => setSource(e.target.value)}>
          {INCOME_SOURCES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <AmountForm id="income-amount" label="Income amount in rupees" submitLabel="Add" onSubmit={(amount) => onAdd(amount, source)} />
    </Card>
  );
}

export default memo(IncomeForm);
