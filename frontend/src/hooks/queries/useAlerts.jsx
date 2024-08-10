import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers';
import { getRequest } from '../../utils/index.js';

export const useCheckAlerts = (options) => {
  const key = 'checkAlerts';
  const url = Api[key];
  const request = getRequest();
  const { setAlert } = useContext(AlertContext);

  const defaultOptions = {
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error(error);
      setAlert('error', error.message, false);
    },
  };

  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const response = await request.get(url);
      return response.data;
    },
    ...defaultOptions,
    ...options,
  });
};

