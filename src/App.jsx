import { lazy, Suspense, useState } from 'react';
import AppShell from './components/layout/AppShell.jsx';
import Dashboard from './features/dashboard/Dashboard.jsx';
import { useFinance } from './hooks/useFinance.js';

// Secondary screens are code-split so the first paint only loads the dashboard.
const Simulator = lazy(() => import('./features/simulator/Simulator.jsx'));
const Subscriptions = lazy(() => import('./features/subscriptions/Subscriptions.jsx'));
const Goals = lazy(() => import('./features/goals/Goals.jsx'));
const Insights = lazy(() => import('./features/insights/Insights.jsx'));
const Activity = lazy(() => import('./features/activity/Activity.jsx'));

export default function App() {
  const { state, metrics, actions } = useFinance();
  const [view, setView] = useState('home');

  const screens = {
    home: <Dashboard state={state} metrics={metrics} actions={actions} />,
    simulate: <Simulator state={state} metrics={metrics} actions={actions} onDone={() => setView('home')} />,
    subscriptions: <Subscriptions state={state} metrics={metrics} actions={actions} />,
    goals: <Goals state={state} metrics={metrics} actions={actions} />,
    insights: <Insights state={state} metrics={metrics} />,
    activity: <Activity state={state} actions={actions} />,
  };

  return (
    <AppShell view={view} onNavigate={setView} state={state} metrics={metrics}>
      <Suspense fallback={<p className="muted loading" role="status" aria-busy="true">Loading…</p>}>{screens[view]}</Suspense>
    </AppShell>
  );
}
