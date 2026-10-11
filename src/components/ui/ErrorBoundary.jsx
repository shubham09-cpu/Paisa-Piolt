import { Component } from 'react';
import PropTypes from 'prop-types';
import { STORAGE_KEYS } from '../../data/constants.js';
import { storage } from '../../services/storage.js';

/** Last line of defence: a render error shows a recovery screen instead of a blank page. */
export default class ErrorBoundary extends Component {
  static propTypes = { children: PropTypes.node };

  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  reset = () => {
    storage.remove(STORAGE_KEYS.state);
    window.location.reload();
  };

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="card error-card" role="alert">
        <h2>Something went wrong</h2>
        <p className="muted">Your saved month may be corrupted. Resetting will start a fresh one.</p>
        <button type="button" className="btn btn--primary" onClick={this.reset}>
          Reset and reload
        </button>
      </div>
    );
  }
}
