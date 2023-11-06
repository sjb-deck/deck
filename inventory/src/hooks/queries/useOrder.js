import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers';

export const useOrder = (id, options) => {
  const key = 'order';
  const url = Api[key].replace(':id', id);
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

  return useQuery(
    [key, id],
    async () => {
      const response = await axios.get(url);
      return response.data.results[0];
    },
    {
      ...defaultOptions,
      ...options,
    },
  );
};
