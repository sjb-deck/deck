import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers';

export const useKitRecipe = (blueprintId, options) => {
  const key = 'kitRecipe';
  const url = Api[key].replace(':id', blueprintId);
  const { setAlert } = useContext(AlertContext);
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

  return useQuery(
    [key, blueprintId],
    async () => {
      if (!blueprintId) return null;
      const response = await axios.get(url);
      return response.data;
    },
    {
      ...defaultOptions,
      ...options,
    },
  );
};
