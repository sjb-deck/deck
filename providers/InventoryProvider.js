import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropTypes } from 'prop-types';
import React from 'react';

import { Theme } from '../components';

const queryClient = new QueryClient();

export const InventoryProvider = ({ children }) => {
  return (
    <Theme>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </LocalizationProvider>
    </Theme>
  );
};

InventoryProvider.propTypes = {
  children: PropTypes.node,
};
