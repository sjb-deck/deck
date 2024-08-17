import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { Theme } from '../components';
import { AlertProvider, CartProvider, KitCartProvider } from '../providers';

import { AuthProvider } from './AuthProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const customRender = (ui, options = {}) => {
  const { cartContext } = options;

  const Wrapper = ({ children }) => {
    return (
      <Theme>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <QueryClientProvider client={queryClient}>
            <AlertProvider>
              <AuthProvider>
                <CartProvider value={cartContext}>
                  <KitCartProvider>
                    <BrowserRouter>{children}</BrowserRouter>
                  </KitCartProvider>
                </CartProvider>
              </AuthProvider>
            </AlertProvider>
          </QueryClientProvider>
        </LocalizationProvider>
      </Theme>
    );
  };

  return rtlRender(ui, { wrapper: Wrapper, ...options });
};
