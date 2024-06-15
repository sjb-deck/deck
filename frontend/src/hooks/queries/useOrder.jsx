import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers';
import { getRequest } from '../../utils';

export const useOrder = (id, options) => {
  const key = 'order';
  const url = Api[key].replace(':id', id);
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
    queryKey: [key, id],
    queryFn: async () => {
      const response = await request.get(url);
      return response.data.results[0];
    },
    ...defaultOptions,
    ...options,
  });
};
