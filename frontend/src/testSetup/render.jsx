import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as rtlRender } from '@testing-library/react';
import AuthProvider from 'react-auth-kit/AuthProvider';
import createStore from 'react-auth-kit/createStore';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { Theme } from '../components';
import {
  AlertProvider,
  CartProvider,
  KitCartProvider,
  NotificationProvider,
} from '../providers';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const store = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
  refresh: vi.fn(),
});

export const customRender = (ui, options = {}) => {
  const { cartContext } = options;

  const Wrapper = ({ children }) => {
    return (
      <Theme>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider store={store}>
              <AlertProvider>
                <NotificationProvider>
                  <CartProvider value={cartContext}>
                    <KitCartProvider>
                      <BrowserRouter>{children}</BrowserRouter>
                    </KitCartProvider>
                  </CartProvider>
                </NotificationProvider>
              </AlertProvider>
            </AuthProvider>
          </QueryClientProvider>
        </LocalizationProvider>
      </Theme>
    );
  };

  return rtlRender(ui, { wrapper: Wrapper, ...options });
};
