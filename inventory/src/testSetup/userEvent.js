import { default as ue } from '@testing-library/user-event';

export const userEvent = ue.setup({
  advanceTimers: jest.advanceTimersByTime,
  writeToClipboard: true,
  pointerEventsCheck: 0,
});
