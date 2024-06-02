import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

import { AlertContext } from '../../../../inventory/src/providers/AlertProvider';
import { getRequest } from '../../../../inventory/src/utils/getRequest';
import { Api } from '../../globals';

export const useEditAccount = (options) => {
  const key = 'edit';
  const url = Api[key];
  const request = getRequest();
  const queryClient = useQueryClient();
  const { setAlert } = useContext(AlertContext);
  const defaultOptions = {
    onSuccess: () => {
      setAlert({
        severity: 'success',
        message: 'Successfully edited account details!',
        autoHide: true,
      });
      queryClient.invalidateQueries('user');
      window.location.href = '/';
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
    async (formData) => {
      const response = await request.post(url, formData);

      if (response.status != 201) throw new Error(response.statusText);

      return response.data;
    },
    { ...defaultOptions, ...options },
  );
};
