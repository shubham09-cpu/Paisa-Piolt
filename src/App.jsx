import { Suspense, useCallback, useEffect } from 'react';
import AppShell from './components/layout/AppShell.jsx';
import Skeleton from './components/ui/Skeleton.jsx';
import { FinanceProvider, useFinanceContext } from './context/FinanceContext.jsx';
import { ToastProvider, useToast } from './context/ToastContext.jsx';
import { useFeedbackActions } from './hooks/useFeedbackActions.js';
import { useHashRoute } from './hooks/useHashRoute.js';
import { prefetchRoutes, ROUTES } from './routes/index.jsx';

/** Active screen + shell. Reads shared state from context and hands it to the routed screen. */
function AppRoutes() {
  const { state, metrics, actions: rawActions } = useFinanceContext();
  const { notify } = useToast();
  const actions = useFeedbackActions(rawActions, notify);
  const [view, navigate] = useHashRoute();
  const Screen = ROUTES[view];

  useEffect(prefetchRoutes, []);
  const goHome = useCallback(() => navigate('home'), [navigate]);

  return (
    <AppShell view={view} onNavigate={navigate} state={state}>
      <Suspense fallback={<Skeleton />}>
        <Screen state={state} metrics={metrics} actions={actions} onDone={goHome} />
      </Suspense>
    </AppShell>
  );
}

/** Composition root: providers wrap the routed app. */
export default function App() {
  return (
    <ToastProvider>
      <FinanceProvider>
        <AppRoutes />
      </FinanceProvider>
    </ToastProvider>
  );
}
