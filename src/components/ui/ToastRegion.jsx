import PropTypes from 'prop-types';

/** Polite live region that shows short confirmations. Each toast can also be dismissed manually. */
export default function ToastRegion({ toasts, onDismiss }) {
  return (
    <div className="toasts" role="status" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.tone}`}>
          <span>{toast.message}</span>
          <button
            type="button"
            className="toast__close"
            aria-label="Dismiss notification"
            onClick={() => onDismiss(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

ToastRegion.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.number.isRequired, message: PropTypes.string.isRequired, tone: PropTypes.string }),
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};
