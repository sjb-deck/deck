import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropTypes } from 'prop-types';
import React from 'react';

import { Theme } from '../components';

import { AlertProvider } from './AlertProvider';
import { CartProvider } from './CartProvider';
import { KitCartProvider } from './KitCartProvider';
import { NotificationProvider } from './NotificationProvider';

const queryClient = new QueryClient();

export const InventoryProvider = ({ children }) => {
  return (
    <Theme>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
          <AlertProvider>
            <NotificationProvider>
              <CartProvider>
                <KitCartProvider>{children}</KitCartProvider>
              </CartProvider>
            </NotificationProvider>
          </AlertProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </Theme>
  );
};

InventoryProvider.propTypes = {
  children: PropTypes.node,
};
