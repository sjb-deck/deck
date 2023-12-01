import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers';
import { buildUrl } from '../../utils';

export const useKit = (params, options) => {
  const key = 'kit';
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
    [key, params],
    async () => {
      const url = buildUrl(Api[key], params);
      const response = await axios.get(url);
      return response.data;
    },
    {
      ...defaultOptions,
      ...options,
    },
  );
};
