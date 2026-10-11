/**
 * Route table: maps each screen id (see `VIEWS` in data/constants.js) to its component.
 * Home is bundled with the entry chunk for a fast first paint; every other screen is a separate lazy chunk.
 */
import { lazy } from 'react';
import Dashboard from '../features/dashboard/Dashboard.jsx';

const loaders = {
  simulate: () => import('../features/simulator/Simulator.jsx'),
  subscriptions: () => import('../features/subscriptions/Subscriptions.jsx'),
  goals: () => import('../features/goals/Goals.jsx'),
  insights: () => import('../features/insights/Insights.jsx'),
  activity: () => import('../features/activity/Activity.jsx'),
};

/** @type {Record<string, import('react').ComponentType<any>>} */
export const ROUTES = {
  home: Dashboard,
  simulate: lazy(loaders.simulate),
  subscriptions: lazy(loaders.subscriptions),
  goals: lazy(loaders.goals),
  insights: lazy(loaders.insights),
  activity: lazy(loaders.activity),
};

/** Warm the browser cache for the other screens once the main thread is idle, so navigation feels instant. */
export function prefetchRoutes() {
  const run = () => Object.values(loaders).forEach((load) => load().catch(() => {}));
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(run, { timeout: 4000 });
  else setTimeout(run, 2000);
}
