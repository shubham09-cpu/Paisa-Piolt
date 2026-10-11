import { memo } from 'react';
import { formatINR } from '../../utils/format.js';
import PropTypes from 'prop-types';

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

BalanceHero.propTypes = {
  balance: PropTypes.number.isRequired,
  allowance: PropTypes.number.isRequired,
  upcoming: PropTypes.number.isRequired,
  daysLeft: PropTypes.number.isRequired,
};

export default memo(BalanceHero);
