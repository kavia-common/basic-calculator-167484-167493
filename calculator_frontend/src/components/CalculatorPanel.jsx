import React, { useState } from 'react';
import Display from './Display';
import Button from './Button';

/**
 * CalculatorPanel manages calculator state and operations.
 * Logic:
 * - current: string for current typed number
 * - prev: previous numeric value
 * - op: current operation ('+', '-', '×', '÷' or null)
 * Rules:
 * - When entering digits, append to current; single leading zero prevented.
 * - Decimal: allow only one per current number.
 * - Operation press:
 *   - If no prev: set prev = parseFloat(current or '0'); clear current.
 *   - If prev exists and current exists: compute prev op current -> prev; clear current.
 *   - Update op to new operation.
 * - Equals:
 *   - If op and (current or repeat lastCurrent): compute result.
 *   - Store lastCurrent to support repeated equals.
 * - Clear: reset all state.
 */
// PUBLIC_INTERFACE
function CalculatorPanel() {
  const [current, setCurrent] = useState('0');
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [history, setHistory] = useState('');
  const [lastCurrent, setLastCurrent] = useState(null); // for repeat equals

  const isOperator = (label) => ['+', '−', '×', '÷'].includes(label);

  const safeParse = (val) => {
    const n = parseFloat(val);
    return Number.isFinite(n) ? n : 0;
  };

  const formatNumber = (val) => {
    // Avoid scientific notation for typical range; limit length
    const asStr = String(val);
    if (asStr.includes('e') || asStr.length > 14) {
      return Number(val.toPrecision(12)).toString();
    }
    return asStr;
  };

  const compute = (a, operator, b) => {
    switch (operator) {
      case '+':
        return a + b;
      case '−':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        if (b === 0) return 'Error';
        return a / b;
      default:
        return b;
    }
  };

  const handleDigit = (label) => {
    setLastCurrent(null);
    setCurrent((curr) => {
      if (curr === '0') return String(label);
      return curr + String(label);
    });
  };

  const handleDecimal = () => {
    setLastCurrent(null);
    setCurrent((curr) => {
      if (curr.includes('.')) return curr;
      return curr + '.';
    });
  };

  const handleClear = () => {
    setCurrent('0');
    setPrev(null);
    setOp(null);
    setHistory('');
    setLastCurrent(null);
  };

  const applyOperation = (nextOp) => {
    // If only operator change without entering current
    if (prev !== null && (current === '' || current === '0') && op) {
      setOp(nextOp);
      setHistory(`${formatNumber(prev)} ${nextOp}`);
      return;
    }

    if (prev === null) {
      const nextPrev = safeParse(current);
      setPrev(nextPrev);
      setCurrent('0');
      setOp(nextOp);
      setHistory(`${formatNumber(nextPrev)} ${nextOp}`);
      return;
    }

    // prev exists and current has a value -> compute chain
    const a = prev;
    const b = safeParse(current);
    const result = compute(a, op || nextOp, b);

    if (result === 'Error') {
      setHistory(`${formatNumber(a)} ${op || nextOp} ${formatNumber(b)}`);
      setCurrent('Error');
      setPrev(null);
      setOp(null);
      return;
    }

    setPrev(result);
    setCurrent('0');
    setOp(nextOp);
    setHistory(`${formatNumber(result)} ${nextOp}`);
  };

  const handleEquals = () => {
    if (!op && prev === null) {
      setHistory('');
      setCurrent((c) => c);
      return;
    }

    let a = prev !== null ? prev : safeParse(current);
    let b;
    if (current !== '0' && current !== '' && current !== 'Error' && lastCurrent === null) {
      b = safeParse(current);
      setLastCurrent(b);
    } else {
      b = lastCurrent !== null ? lastCurrent : safeParse(current);
    }

    const operatorToUse = op || '+';
    const result = compute(a, operatorToUse, b);

    if (result === 'Error') {
      setHistory(`${formatNumber(a)} ${operatorToUse} ${formatNumber(b)}`);
      setCurrent('Error');
      setPrev(null);
      setOp(null);
      return;
    }

    setHistory(`${formatNumber(a)} ${operatorToUse} ${formatNumber(b)} =`);
    setCurrent(formatNumber(result));
    setPrev(result);
    // retain op for repeated equals
  };

  const handleClick = (label) => {
    if (label === 'C') {
      handleClear();
      return;
    }
    if (label === '.') {
      handleDecimal();
      return;
    }
    if (label === '=') {
      handleEquals();
      return;
    }
    if (isOperator(label)) {
      applyOperation(label);
      return;
    }
    // digits
    handleDigit(label);
  };

  const opActive = (symbol) => op === symbol;

  return (
    <section className="calc-panel" aria-label="Calculator">
      <Display history={history} value={current} />
      <div className="calc-grid" role="group" aria-label="Calculator keypad">
        {/* Row 1 */}
        <Button label="C" variant="clear" onClick={handleClick} ariaLabel="Clear" />
        <Button label="÷" variant="op" onClick={handleClick} ariaLabel="Divide" />
        <Button label="×" variant="op" onClick={handleClick} ariaLabel="Multiply" />
        <Button label="−" variant="op" onClick={handleClick} ariaLabel="Subtract" />

        {/* Row 2 */}
        <Button label={7} onClick={handleClick} />
        <Button label={8} onClick={handleClick} />
        <Button label={9} onClick={handleClick} />
        <Button
          label="+"
          variant={`op${opActive('+') ? ' active' : ''}`}
          onClick={handleClick}
          ariaLabel="Add"
        />

        {/* Row 3 */}
        <Button label={4} onClick={handleClick} />
        <Button label={5} onClick={handleClick} />
        <Button label={6} onClick={handleClick} />
        <Button label="=" variant="equal" onClick={handleClick} ariaLabel="Equals" />

        {/* Row 4 */}
        <Button label={1} onClick={handleClick} />
        <Button label={2} onClick={handleClick} />
        <Button label={3} onClick={handleClick} />
        <Button label="." onClick={handleClick} ariaLabel="Decimal point" />

        {/* Row 5 */}
        <Button label={0} onClick={handleClick} grow />
      </div>
    </section>
  );
}

export default CalculatorPanel;
