import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers';
import { getRequest } from '../../utils';

export const useSubmitKitOrder = (options) => {
  const key = 'submitKitOrder';
  const url = Api[key];
  const request = getRequest();
  const { setAlert } = useContext(AlertContext);
  const defaultOptions = {
    onSuccess: () => {
      setAlert({
        severity: 'success',
        message: 'Successfully withdrew kit(s)!',
        autoHide: true,
      });
    },
    onError: (error) => {
      console.error(error);
      setAlert({
        severity: 'error',
        message: error.message,
        autoHide: false,
        additionalInfo: error.response?.data?.message,
      });
    },
  };

  return useMutation({
    mutationFn: async (payload) => {
      const response = await request.post(url, payload);
      if (response.status != 200) throw new Error(response.statusText);
      return response.data;
    },
    ...defaultOptions,
    ...options,
  });
};
