import PropTypes from 'prop-types';

/** Toggle switch exposed to assistive tech as role="switch". */
export default function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="switch"
      onClick={onChange}
    />
  );
}

Switch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};
