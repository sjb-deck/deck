import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers/AlertProvider';
import { getRequest } from '../../utils/getRequest';

export const useNewExpiryDate = (options) => {
  const key = 'submitNewExpiryDate';
  const url = Api[key];
  const request = getRequest();
  const { setAlert } = useContext(AlertContext);
  const queryClient = useQueryClient();
  const defaultOptions = {
    onSuccess: () => {
      setAlert({
        severity: 'success',
        message: 'Successfully added new expiry date!',
        autoHide: true,
      });
      queryClient.invalidateQueries('items');
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
    mutationFn: async (newExpiryDate) => {
      const response = await request.post(url, newExpiryDate);
      if (response.status != 201) throw new Error(response.statusText);
      return response.data;
    },
    ...defaultOptions,
    ...options,
  });
};
