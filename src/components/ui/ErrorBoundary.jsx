import { Component } from 'react';

/** Last line of defence: a render error shows a recovery screen instead of a blank page. */
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  reset = () => {
    try {
      window.localStorage.removeItem('paisa-pilot:v1');
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="card" role="alert" style={{ margin: 24 }}>
        <h2>Something went wrong</h2>
        <p className="muted">Your saved month may be corrupted. Resetting will start a fresh one.</p>
        <button type="button" className="btn btn--primary" onClick={this.reset}>Reset and reload</button>
      </div>
    );
  }
}
