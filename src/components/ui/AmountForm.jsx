import { useState } from 'react';
import PropTypes from 'prop-types';
import { parseAmount } from '../../lib/sanitize.js';

/**
 * Validated amount input used everywhere money is entered.
 * Shows an accessible error (role="alert", aria-invalid, aria-describedby) instead of silently ignoring bad input.
 */
export default function AmountForm({ id, label, submitLabel, onSubmit, primary = false, placeholder = 'Amount ₹' }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = parseAmount(value);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError('');
    onSubmit(result.value);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="inline">
        <label className="sr-only" htmlFor={id}>
          {label}
        </label>
        <input
          id={id}
          className="input"
          type="number"
          inputMode="decimal"
          min="1"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button type="submit" className={`btn ${primary ? 'btn--primary' : ''}`}>
          {submitLabel}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="field-error">
          {error}
        </p>
      )}
    </form>
  );
}

AmountForm.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  submitLabel: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  primary: PropTypes.bool,
  placeholder: PropTypes.string,
};
