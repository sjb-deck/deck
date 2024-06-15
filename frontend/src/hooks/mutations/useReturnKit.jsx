import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers/AlertProvider';
import { getRequest } from '../../utils/getRequest';

export const useReturnKit = (options) => {
  const key = 'returnKit';
  const url = Api[key];
  const request = getRequest();
  const queryClient = useQueryClient();
  const { setAlert } = useContext(AlertContext);

  const defaultOptions = {
    onSuccess: () => {
      window.location.href = '/inventory/kits';
      queryClient.invalidateQueries('kits');

      setAlert({
        severity: 'success',
        message: 'Successfully returned and updated kit!',
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
    mutationFn: async (id) => {
      const response = await request.post(url, id);
      if (response.status != 200) throw new Error(response.statusText);
      return response.data;
    },
    ...defaultOptions,
    ...options,
  });
};
