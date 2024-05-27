import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

import { Api } from '../../globals';
import { AlertContext } from '../../providers';
import { getRequest } from '../../utils/getRequest';

export const useRevertOrder = (options) => {
  const key = 'revertOrder';
  const url = Api[key];
  const request = getRequest();
  const queryClient = useQueryClient();
  const { setAlert } = useContext(AlertContext);
  const defaultOptions = {
    onSuccess: async () => {
      await queryClient.invalidateQueries('orders');
      await queryClient.invalidateQueries('order');
      await queryClient.invalidateQueries('items');
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

  return useMutation(
    async (id) => {
      const response = await request.post(url, { id: id });
      if (response.status != 200) throw new Error(response.statusText);
      return response.data;
    },
    { ...defaultOptions, ...options },
  );
};
