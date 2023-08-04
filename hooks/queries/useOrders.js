import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers';

export const useOrders = (options) => {
  const key = 'orders';
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
      const results = {
        orders: [],
        loan_orders: [],
      };
      response.data.forEach((o) =>
        o.reason === 'loan'
          ? results.loan_orders.push(o)
          : results.orders.push(o),
      );
      return results;
    },
    {
      ...defaultOptions,
      ...options,
    },
  );
};
