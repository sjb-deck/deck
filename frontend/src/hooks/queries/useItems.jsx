import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers/AlertProvider';
import { getRequest } from '../../utils';

export const useItems = (options) => {
  const key = 'items';
  const url = Api[key];
  const { setAlert } = useContext(AlertContext);
  const request = getRequest();
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

  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const response = await request.get(url);
      const data = response.data.reduce((acc, item) => {
        // Filter out items that are supposed to have expiry but do not have any unarchived expiry dates
        if (!item.expiry_dates || item.expiry_dates.some((x) => !x.archived)) {
          // Filter out archived expiry dates
          item.expiry_dates = item.expiry_dates.filter((x) => !x.archived);
          acc.push(item);
        }
        return acc;
      }, []);
      return data;
    },
    ...defaultOptions,
    ...options,
  });
};
