import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import AuthProvider from 'react-auth-kit/AuthProvider';
import createRefresh from 'react-auth-kit/createRefresh';
import createStore from 'react-auth-kit/createStore';

import { Theme } from '../components';
import { Api } from '../globals/api';

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

const refresh = createRefresh({
  interval: 5,
  refreshApiCallback: async (param) => {
    try {
      const response = await axios.post(
        Api.refresh,
        { refresh: param.refreshToken },
        {
          headers: { Authorization: `Bearer ${param.authToken}` },
        },
      );
      return {
        isSuccess: true,
        newAuthToken: response.data.access,
        newAuthTokenExpireIn: 10,
        newRefreshTokenExpiresIn: 60,
      };
    } catch (error) {
      console.error(error);
      return {
        isSuccess: false,
      };
    }
  },
});

const store = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
  refresh: refresh,
});

export const DeckProvider = ({ children }) => {
  return (
    <Theme>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider store={store}>
            <AlertProvider>
              <CartProvider>
                <KitCartProvider>{children}</KitCartProvider>
              </CartProvider>
            </AlertProvider>
          </AuthProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </Theme>
  );
};
