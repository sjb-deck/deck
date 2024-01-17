import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

import { Api } from '../../globals';
import { AlertContext } from '../../providers';
import { getRequest } from '../../utils/getRequest';

export const useAddBlueprint = (options) => {
  const key = 'addBlueprint';
  const url = Api[key];
  const request = getRequest();
  const queryClient = useQueryClient();
  const { setAlert } = useContext(AlertContext);
  const defaultOptions = {
    onSuccess: () => {
      setAlert({
        severity: 'success',
        message: 'Successfully added blueprint!',
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

  return useMutation(
    async (order) => {
      const response = await request.post(url, order);

      if (response.status != 201) throw new Error(response.statusText);

      return response.data;
    },
    { ...defaultOptions, ...options },
  );
};
