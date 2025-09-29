import React from 'react';
import './App.css';
import CalculatorPanel from './components/CalculatorPanel';

/**
 * App entry rendering the CalculatorPanel
 * Follows the Ocean Professional theme handled in App.css.
 */
// PUBLIC_INTERFACE
function App() {
  /** Root wrapper with gradient background and centered calculator */
  return (
    <div className="ocean-app">
      <div className="ocean-gradient" />
      <main className="ocean-container" role="main" aria-label="Calculator application">
        <header className="ocean-header">
          <h1 className="ocean-title">Calculator</h1>
          <p className="ocean-subtitle">Simple, modern arithmetic</p>
        </header>
        <CalculatorPanel />
        <footer className="ocean-footer">
          <span>Ocean Professional</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
