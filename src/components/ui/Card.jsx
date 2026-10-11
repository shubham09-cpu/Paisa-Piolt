import { useId } from 'react';
import PropTypes from 'prop-types';
import { toneType } from '../../types.js';

/** Basic surface. `tone` adds a coloured accent edge for alerts; `aside` is placed on the right of the header. */
function Card({ title, subtitle, tone, className = '', children, aside }) {
  const titleId = useId();
  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      className={`card ${tone ? `card--${tone}` : ''} ${className}`.trim()}
    >
      {(title || aside) && (
        <header className="card__head">
          <div>
            {title && (
              <h2 id={titleId} className="card__title">
                {title}
              </h2>
            )}
            {subtitle && <p className="muted">{subtitle}</p>}
          </div>
          {aside}
        </header>
      )}
      {children}
    </section>
  );
}

Card.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  tone: toneType,
  className: PropTypes.string,
  children: PropTypes.node,
  aside: PropTypes.node,
};

export default Card;
