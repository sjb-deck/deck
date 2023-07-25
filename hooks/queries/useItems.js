import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { Api } from '../../globals/api';

const defaultOptions = {
  refetchOnWindowFocus: false,
};

export const useItems = (options) => {
  const key = 'items';
  const url = Api[key];

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
