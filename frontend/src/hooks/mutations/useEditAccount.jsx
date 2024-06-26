import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Api } from '../../globals/api';
import { URL_BASE_INV } from '../../globals/urls';
import { AlertContext } from '../../providers';
import { getRequest } from '../../utils';

export const useEditAccount = (options) => {
  const key = 'edit';
  const url = Api[key];
  const request = getRequest();
  const queryClient = useQueryClient();
  const { setAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  const defaultOptions = {
    onSuccess: () => {
      setAlert({
        severity: 'success',
        message: 'Successfully edited account details!',
        autoHide: true,
      });
      queryClient.invalidateQueries('user');
      navigate(URL_BASE_INV);
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
    mutationFn: async (formData) => {
      const response = await request.post(url, formData);

      if (response.status != 201) throw new Error(response.statusText);

      return response.data;
    },
    ...defaultOptions,
    ...options,
  });
};
