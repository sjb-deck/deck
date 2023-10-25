import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

import { Api } from '../../globals';
import { AlertContext } from '../../providers';
import { getRequest } from '../../../items/src/utils/getRequest';

export const useRevertOrder = (options) => {
  const key = 'revertOrder';
  const url = Api[key];
  const request = getRequest();
  const queryClient = useQueryClient();
  const { setAlert } = useContext(AlertContext);
  const defaultOptions = {
    onSuccess: async () => await queryClient.invalidateQueries('orders'),
    onError: (error) => {
      console.error(error);
      setAlert('error', error.message, false);
    },
  };

  return useMutation(
    async (id) => {
      const response = await request.post(url, id);
      if (response.status != 200) throw new Error(response.statusText);
      return response.data;
    },
    { ...defaultOptions, ...options },
  );
};
