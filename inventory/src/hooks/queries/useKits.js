import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers';

export const useKits = (options, status) => {
  const key = 'kits';
  let url = Api[key];
  if (status) {
    url += `?status=${status}`;
  }
  const { setAlert } = useContext(AlertContext);
  const defaultOptions = {
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error(error);
      setAlert('error', error.message, false);
    },
  };

  return useQuery(
    [key],
    async () => {
      const response = await axios.get(url);
      return response.data;
    },
    {
      ...defaultOptions,
      ...options,
    },
  );
};
