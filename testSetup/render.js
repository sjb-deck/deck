import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import React from 'react';

import { Theme } from '../components';
import { AlertProvider, CartProvider } from '../providers';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const customRender = (node, options) => {
  const { cartContext, ...opts } = options ?? {};
  return render(node, {
    wrapper: ({ children }) => (
      <Theme>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <QueryClientProvider client={queryClient}>
            <AlertProvider>
              <CartProvider value={cartContext}>{children}</CartProvider>
            </AlertProvider>
          </QueryClientProvider>
        </LocalizationProvider>
      </Theme>
    ),
    ...opts,
  });
};
