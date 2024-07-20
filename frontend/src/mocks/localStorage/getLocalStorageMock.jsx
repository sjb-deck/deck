import { vi } from 'vitest';

export const getLocalStorageMock = (options) => {
  return {
    getItem: vi.fn().mockReturnValue(null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    ...options,
  };
};
