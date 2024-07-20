import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { server } from './src/mocks';

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useParams: vi.fn(),
  useNavigate: vi.fn().mockReturnValue(vi.fn()),
  BrowserRouter: vi.fn().mockImplementation((props) => props.children),
}));

const originalLocalStorage = window.localStorage;

// Establish API mocking before all tests.
beforeAll(() => {
  server.listen();
  vi.useFakeTimers();
  // Temporary workaround https://github.com/testing-library/user-event/issues/1115
  globalThis.jest = {
    advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
  };
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
  Object.defineProperty(window, 'localStorage', {
    value: originalLocalStorage,
  });
});

// Clean up after the tests are finished.
afterAll(() => {
  server.close();
  vi.useRealTimers();
});
