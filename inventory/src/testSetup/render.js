import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as rtlRender } from '@testing-library/react';
import React from 'react';

import { Theme } from '../components';
import { AlertProvider, CartProvider } from '../providers';

export const customRender = (ui, options = {}) => {
  const { cartContext } = options;

  const Wrapper = ({ children }) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    return (
      <Theme>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <QueryClientProvider client={queryClient}>
            <AlertProvider>
              <CartProvider value={cartContext}>{children}</CartProvider>
            </AlertProvider>
          </QueryClientProvider>
        </LocalizationProvider>
      </Theme>
    );
  };

  return rtlRender(ui, { wrapper: Wrapper, ...options });
};
