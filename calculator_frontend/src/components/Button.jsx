import React from 'react';
import PropTypes from 'prop-types';

/**
 * Calculator button with variants and accessible labeling.
 * - variant: 'default' | 'op' | 'equal' | 'clear'
 * - grow: if true, spans two columns (used for zero)
 */
// PUBLIC_INTERFACE
function Button({ label, onClick, variant = 'default', grow = false, ariaLabel }) {
  const classes = ['calc-btn'];
  if (variant !== 'default') classes.push(variant);
  if (grow) classes.push('zero');

  const accessible = ariaLabel || label;

  return (
    <button
      type="button"
      className={classes.join(' ')}
      onClick={() => onClick(label)}
      aria-label={accessible}
    >
      {label}
    </button>
  );
}

Button.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['default', 'op', 'equal', 'clear']),
  grow: PropTypes.bool,
  ariaLabel: PropTypes.string
};

export default Button;
