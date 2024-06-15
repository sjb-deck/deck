import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers/AlertProvider';
import { buildUrl, getRequest } from '../../utils';

export const useKitHistory = (params, options) => {
  const key = 'kitHistory';
  const { setAlert } = useContext(AlertContext);
  const url = buildUrl(Api[key], params);
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
    queryKey: [key, params],
    queryFn: async () => {
      const response = await request.get(url);
      return response.data;
    },
    ...defaultOptions,
    ...options,
  });
};
