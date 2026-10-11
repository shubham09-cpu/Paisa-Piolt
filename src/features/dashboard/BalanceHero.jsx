import { memo } from 'react';
import { formatINR } from '../../lib/format.js';

function BalanceHero({ balance, allowance, upcoming, daysLeft }) {
  return (
    <section className="hero" aria-label="Balance summary">
      <p className="hero__label">Balance</p>
      <p className="hero__balance">{formatINR(balance)}</p>
      <dl className="hero__stats">
        <div>
          <dt>Safe to spend today</dt>
          <dd>{formatINR(allowance)}</dd>
        </div>
        <div>
          <dt>Bills ahead</dt>
          <dd>{formatINR(upcoming)}</dd>
        </div>
        <div>
          <dt>Days left</dt>
          <dd>{daysLeft}</dd>
        </div>
      </dl>
    </section>
  );
}

export default memo(BalanceHero);
