import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers';
import { getRequest } from '../../utils';

export const useKitRestockOptions = (kitId, options) => {
  const key = 'kitRestockOptions';
  const { setAlert } = useContext(AlertContext);
  const request = getRequest();

  const defaultOptions = {
    refetchOnWindowFocus: false,
    onError: (error) => {
      setAlert({
        severity: 'error',
        message: error.message,
        autoHide: false,
        additionalInfo: error.response?.data?.message,
      });
    },
  };

  return useQuery({
    queryKey: [key, kitId],
    queryFn: async () => {
      const url = Api[key].replace(':id', kitId);
      const response = await request.get(url);
      return response.data;
    },
    ...defaultOptions,
    ...options,
  });
};
