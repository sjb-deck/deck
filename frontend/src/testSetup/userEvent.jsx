import { default as ue } from '@testing-library/user-event';
import { vi } from 'vitest';

export const userEvent = ue.setup({
  advanceTimers: vi.advanceTimersByTime.bind(vi),
  writeToClipboard: true,
  pointerEventsCheck: 0,
});
