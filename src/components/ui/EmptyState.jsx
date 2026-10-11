import PropTypes from 'prop-types';

/** Friendly message for lists with nothing to show yet. */
export default function EmptyState({ icon, title, hint, children }) {
  return (
    <div className="empty">
      <span className="empty__icon" aria-hidden="true">
        {icon}
      </span>
      <p className="empty__title">{title}</p>
      {hint && <p className="muted">{hint}</p>}
      {children}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  hint: PropTypes.string,
  children: PropTypes.node,
};
