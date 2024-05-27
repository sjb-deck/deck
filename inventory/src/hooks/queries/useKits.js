import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers';

export const useKits = (options) => {
  const key = 'kits';
  const url = Api[key];
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
