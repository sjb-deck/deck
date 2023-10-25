import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

import { Api } from '../../globals';
import { AlertContext } from '../../providers';
import { getRequest } from '../../../items/src/utils/getRequest';

export const useNewExpiryDate = (options) => {
  const key = 'submitNewExpiryDate';
  const url = Api[key];
  const request = getRequest();
  const { setAlert } = useContext(AlertContext);
  const queryClient = useQueryClient();
  const defaultOptions = {
    onSuccess: () => {
      setAlert('success', 'Deposit successfully!', true);
      queryClient.invalidateQueries('items');
    },
    onError: (error) => {
      console.error(error);
      setAlert('error', 'Error! Please try again.', false);
    },
  };

  return useMutation(
    async (newExpiryDate) => {
      const response = await request.post(url, newExpiryDate);

      if (response.status != 201) throw new Error(response.statusText);

      return response.data;
    },
    { ...defaultOptions, ...options },
  );
};
