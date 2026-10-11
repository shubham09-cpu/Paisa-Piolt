import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ToastProvider, useToast } from './ToastContext.jsx';

function Trigger() {
  const { notify } = useToast();
  return <button onClick={() => notify('Saved ₹100')}>go</button>;
}

const renderToasts = () =>
  render(
    <ToastProvider>
      <Trigger />
    </ToastProvider>,
  );

describe('ToastProvider', () => {
  afterEach(() => vi.useRealTimers());

  it('shows a toast and removes it after the timeout', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderToasts();
    await user.click(screen.getByRole('button', { name: 'go' }));
    expect(screen.getByText('Saved ₹100')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.queryByText('Saved ₹100')).not.toBeInTheDocument();
  });

  it('can be dismissed manually', async () => {
    renderToasts();
    await userEvent.click(screen.getByRole('button', { name: 'go' }));
    await userEvent.click(screen.getByRole('button', { name: /dismiss notification/i }));
    expect(screen.queryByText('Saved ₹100')).not.toBeInTheDocument();
  });
});
