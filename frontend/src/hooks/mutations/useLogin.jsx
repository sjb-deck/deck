import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';
import useSignIn from 'react-auth-kit/hooks/useSignIn';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers/AlertProvider';

export const useLogin = (options) => {
  const key = 'login';
  const url = Api[key];
  const { setAlert } = useContext(AlertContext);
  const signIn = useSignIn();

  const defaultOptions = {
    refetchOnWindowFocus: false,
    onError: (error) => {
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
      signIn({
        auth: {
          token: data.access,
          type: 'Bearer',
        },
        refresh: data.refresh,
        userState: data.user,
      });
      setAlert({
        severity: 'success',
        message: 'Login successful',
        autoHide: true,
      });
    },
  };

  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(url, data);
      return response.data;
    },
    ...defaultOptions,
    ...options,
  });
};
