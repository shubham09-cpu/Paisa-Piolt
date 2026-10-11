import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { setup } from '../../test/fixtures.js';
import Subscriptions from './Subscriptions.jsx';

describe('Subscriptions', () => {
  it('exposes each subscription as an accessible switch and toggles it', async () => {
    const { state, metrics, actions } = setup();
    render(<Subscriptions state={state} metrics={metrics} actions={actions} />);
    const netflix = screen.getByRole('switch', { name: /netflix/i });
    expect(netflix).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(netflix);
    expect(actions.toggleSubscription).toHaveBeenCalledWith('netflix');
  });
});
