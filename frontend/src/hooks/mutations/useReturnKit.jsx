import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Api } from '../../globals/api';
import { URL_INV_VIEW_KITS } from '../../globals/urls';
import { AlertContext } from '../../providers/AlertProvider';
import { getRequest } from '../../utils/getRequest';

export const useReturnKit = (options) => {
  const key = 'returnKit';
  const url = Api[key];
  const request = getRequest();
  const queryClient = useQueryClient();
  const { setAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  const defaultOptions = {
    onSuccess: () => {
      navigate(URL_INV_VIEW_KITS);
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
