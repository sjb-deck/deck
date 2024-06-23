import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers/AlertProvider';
import { getRequest } from '../../utils';

export const useActiveLoans = (page, options) => {
  const key = 'loan_active';
  const url = Api[key].replace(':page', page);
  const request = getRequest();
  const { setAlert } = useContext(AlertContext);
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
    queryKey: [key, page],
    queryFn: async () => {
      const response = await request.get(url);
      return response.data;
    },
    ...defaultOptions,
    ...options,
  });
};
