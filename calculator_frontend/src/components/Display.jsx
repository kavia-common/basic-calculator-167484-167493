import React from 'react';
import PropTypes from 'prop-types';

/**
 * Display shows previous expression context and current value.
 * - history: string of last operation or expression
 * - value: current input or computed result
 */
// PUBLIC_INTERFACE
function Display({ history, value }) {
  return (
    <div className="calc-display" role="region" aria-label="Calculator display">
      <div className="history" aria-live="polite">{history}</div>
      <div className="value" aria-live="polite">{value}</div>
    </div>
  );
}

Display.propTypes = {
  history: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

Display.defaultProps = {
  history: ''
};

export default Display;
