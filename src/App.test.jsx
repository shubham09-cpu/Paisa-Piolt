import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App.jsx';

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '';
  });

  it('renders the dashboard with landmarks and starting balance', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getAllByText('₹10,000').length).toBeGreaterThan(0);
  });

  it('logging a spend lowers the balance and the safe-to-spend figure updates', async () => {
    render(<App />);
    await userEvent.type(screen.getByLabelText(/spend amount/i), '500');
    await userEvent.click(
      within(screen.getByRole('region', { name: /log a spend/i })).getByRole('button', { name: 'Add' }),
    );
    expect(screen.getAllByText('₹9,500').length).toBeGreaterThan(0);
  });

  it('navigates to the simulator via the nav bar', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /simulate/i }));
    expect(await screen.findByRole('heading', { name: /decision simulator/i })).toBeInTheDocument();
  });

  it('shows a confirmation toast after logging a spend', async () => {
    render(<App />);
    await userEvent.type(screen.getByLabelText(/spend amount/i), '120');
    await userEvent.click(
      within(screen.getByRole('region', { name: /log a spend/i })).getByRole('button', { name: 'Add' }),
    );
    expect(await screen.findByText(/Logged ₹120 on Food/)).toBeInTheDocument();
  });

  it('keeps the URL hash in sync with the active screen', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /goals/i }));
    expect(window.location.hash).toBe('#/goals');
    expect(await screen.findByRole('heading', { name: /savings goals/i })).toBeInTheDocument();
  });
});
