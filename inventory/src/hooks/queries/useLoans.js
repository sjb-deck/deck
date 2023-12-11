import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers';
import { buildUrl } from '../../utils';

export const useLoans = (params, options) => {
  const key = 'loans';
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
    [key, params],
    async () => {
      const url = buildUrl(Api['loans'], params);
      const response = await axios.get(url);
      return response.data;
    },
    {
      ...defaultOptions,
      ...options,
    },
  );
};
