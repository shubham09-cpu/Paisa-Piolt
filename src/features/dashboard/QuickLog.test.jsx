import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import QuickLog from './QuickLog.jsx';

describe('QuickLog', () => {
  it('logs a valid spend with the chosen category', async () => {
    const onLog = vi.fn();
    render(<QuickLog onLog={onLog} />);
    await userEvent.click(screen.getByRole('button', { name: 'Fun' }));
    await userEvent.type(screen.getByLabelText(/spend amount/i), '250');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(onLog).toHaveBeenCalledWith(250, 'Fun');
  });

  it('shows an accessible error for an invalid amount and does not log', async () => {
    const onLog = vi.fn();
    render(<QuickLog onLog={onLog} />);
    await userEvent.type(screen.getByLabelText(/spend amount/i), '-5');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/greater than 0/i);
    expect(screen.getByLabelText(/spend amount/i)).toHaveAttribute('aria-invalid', 'true');
    expect(onLog).not.toHaveBeenCalled();
  });
});
