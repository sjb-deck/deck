import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';
import { signIn } from '../auth/authHook';

import { Api, invalidateQueryKeys } from '../../globals/api';
import { AlertContext } from '../../providers/AlertProvider';

export const useLogin = (options) => {
  const key = 'login';
  const url = Api[key];
  const { setAlert } = useContext(AlertContext);
  const queryClient = useQueryClient();

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
      signIn(
        data.access,
        data.refresh,
        data.user,
      );
      setAlert({
        severity: 'success',
        message: 'Login successful',
        autoHide: true,
      });
      invalidateQueryKeys()[key].forEach((key) =>
        queryClient.invalidateQueries(key),
      );
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
