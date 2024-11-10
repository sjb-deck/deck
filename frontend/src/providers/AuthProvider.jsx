import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { createContext, useEffect, useContext } from 'react';

import { Api } from '../globals/api';
import { staySignedIn, signOut, getRefreshToken } from '../hooks/auth/authHook';

import { AlertContext } from './AlertProvider';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { setAlert } = useContext(AlertContext);
  const useRefreshAuthToken = (options) => {
    const defaultOptions = {
      refetchOnWindowFocus: false,
      onError: (error) => {
        signOut();
        if (error.response?.status === 401) return;
        console.error(error);
        setAlert({
          severity: 'error',
          message: error.message,
          autoHide: false,
          additionalInfo: error.response?.data?.message,
        });
      },
      onSuccess: (data) => {
        staySignedIn(data.access, data.refresh);
      },
    };
    return useMutation({
      mutationFn: async (data) => {
        const response = await axios.post(Api['refresh'], data);
        return response.data;
      },
      ...defaultOptions,
      ...options,
    });
  };

  const { mutate } = useRefreshAuthToken();

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (getRefreshToken()) {
        mutate({ refresh: getRefreshToken() });
      } else {
        signOut();
      }
    };
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 1100000);
    return () => clearInterval(interval);
  }, [mutate]);

  return <AuthContext.Provider>{children}</AuthContext.Provider>;
};
