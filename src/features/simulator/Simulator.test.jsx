import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { setup } from '../../test/fixtures.js';
import Simulator from './Simulator.jsx';

describe('Simulator', () => {
  it('shows a before/after impact table and a verdict', () => {
    const { state, metrics, actions } = setup();
    render(<Simulator state={state} metrics={metrics} actions={actions} onDone={() => {}} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Daily allowance')).toBeInTheDocument();
    // <output> also has the implicit status role, so find the verdict by its text instead.
    expect(screen.getByText(/safe\.|doable|not now/i)).toBeInTheDocument();
  });

  it('does not change anything until Commit is pressed', async () => {
    const { state, metrics, actions } = setup();
    const onDone = vi.fn();
    render(<Simulator state={state} metrics={metrics} actions={actions} onDone={onDone} />);
    await userEvent.click(screen.getByRole('button', { name: 'New subscription' }));
    expect(actions.commitDecision).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Commit' }));
    expect(actions.commitDecision).toHaveBeenCalledWith(expect.objectContaining({ type: 'subscription' }));
    expect(onDone).toHaveBeenCalled();
  });

  it('Skip leaves state untouched', async () => {
    const { state, metrics, actions } = setup();
    const onDone = vi.fn();
    render(<Simulator state={state} metrics={metrics} actions={actions} onDone={onDone} />);
    await userEvent.click(screen.getByRole('button', { name: 'Skip it' }));
    expect(actions.commitDecision).not.toHaveBeenCalled();
    expect(onDone).toHaveBeenCalled();
  });
});
