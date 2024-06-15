import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers/AlertProvider';
import { buildUrl, getRequest } from '../../utils';

export const useLoans = (params, options) => {
  const key = 'loans';
  const { setAlert } = useContext(AlertContext);
  const request = getRequest();
  const defaultOptions = {
    refetchOnWindowFocus: false,
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

  return useQuery({
    queryKey: [key, params],
    queryFn: async () => {
      const url = buildUrl(Api['loans'], params);
      const response = await request.get(url);
      return response.data;
    },
    ...defaultOptions,
    ...options,
  });
};
