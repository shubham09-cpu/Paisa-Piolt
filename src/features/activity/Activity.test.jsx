import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ACTIVITY_PAGE_SIZE } from '../../data/constants.js';
import { setup } from '../../test/fixtures.js';
import Activity from './Activity.jsx';

const tx = (id, kind = 'spend') => ({ id, day: 1, label: `Item ${id}`, amount: 10, kind });

describe('Activity', () => {
  it('shows an empty state when there are no entries', () => {
    const { state, actions } = setup();
    render(<Activity state={state} actions={actions} />);
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
  });

  it('pages long histories behind a Show more button', async () => {
    const transactions = Array.from({ length: ACTIVITY_PAGE_SIZE + 5 }, (_, i) => tx(i + 1));
    const { state, actions } = setup({ transactions });
    render(<Activity state={state} actions={actions} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(ACTIVITY_PAGE_SIZE);
    await userEvent.click(screen.getByRole('button', { name: /show more/i }));
    expect(screen.getAllByRole('listitem')).toHaveLength(ACTIVITY_PAGE_SIZE + 5);
  });

  it('asks for confirmation before resetting the month', async () => {
    const { state, actions } = setup();
    render(<Activity state={state} actions={actions} />);
    await userEvent.click(screen.getByRole('button', { name: 'Reset month' }));
    expect(actions.reset).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Yes, reset' }));
    expect(actions.reset).toHaveBeenCalledTimes(1);
  });
});
