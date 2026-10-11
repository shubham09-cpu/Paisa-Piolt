import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { useFinance } from '../hooks/useFinance.js';

const FinanceContext = createContext(null);

/** Owns the finance state machine once and shares `{ state, metrics, actions }` with the tree. */
export function FinanceProvider({ children }) {
  const value = useFinance();
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

FinanceProvider.propTypes = { children: PropTypes.node.isRequired };

/** Read the shared finance value. Must be used inside `<FinanceProvider>`. */
export function useFinanceContext() {
  const value = useContext(FinanceContext);
  if (!value) throw new Error('useFinanceContext must be used inside <FinanceProvider>');
  return value;
}
