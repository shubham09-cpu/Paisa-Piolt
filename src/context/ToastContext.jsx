import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { TOAST_MS } from '../data/constants.js';
import ToastRegion from '../components/ui/ToastRegion.jsx';

const ToastContext = createContext({ notify: () => {} });
const MAX_VISIBLE = 3;

/** Provides `notify(message, tone)` for short, auto-dismissing confirmations. */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);
  const timers = useRef(new Set());

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const notify = useCallback(
    (message, tone = 'good') => {
      const id = nextId.current++;
      setToasts((list) => [...list.slice(-(MAX_VISIBLE - 1)), { id, message, tone }]);
      const timer = setTimeout(() => {
        timers.current.delete(timer);
        dismiss(id);
      }, TOAST_MS);
      timers.current.add(timer);
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

ToastProvider.propTypes = { children: PropTypes.node.isRequired };

/** @returns {{ notify: (message: string, tone?: 'good' | 'warn' | 'bad' | 'info') => void }} */
export function useToast() {
  return useContext(ToastContext);
}
