import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './AuthProvider';

import { Theme } from '../components';

import { AlertProvider } from './AlertProvider';
import { CartProvider } from './CartProvider';
import { KitCartProvider } from './KitCartProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const DeckProvider = ({ children }) => {
  return (
    <Theme>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
            <AlertProvider>
              <AuthProvider>
                <CartProvider>
                  <KitCartProvider>{children}</KitCartProvider>
                </CartProvider>
              </AuthProvider>
            </AlertProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </Theme>
  );
};
