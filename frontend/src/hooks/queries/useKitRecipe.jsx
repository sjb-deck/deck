import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers/AlertProvider';
import { getRequest } from '../../utils';

export const useKitRecipe = (blueprintId, options) => {
  const key = 'kitRecipe';
  const url = Api[key].replace(':id', blueprintId);
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
    queryKey: [key, blueprintId],
    queryFn: async () => {
      if (!blueprintId) return null;
      const response = await request.get(url);
      return response.data;
    },
    ...defaultOptions,
    ...options,
  });
};
