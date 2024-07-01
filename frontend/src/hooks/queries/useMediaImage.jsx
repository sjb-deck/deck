import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { Api } from '../../globals/api';
import { AlertContext } from '../../providers';
import { buildUrl, getRequest } from '../../utils';

export const useMediaImage = (src) => {
  const key = 'media';
  const url = Api[key];
  const { setAlert } = useContext(AlertContext);
  const request = getRequest({ responseType: 'blob' });

  return useQuery({
    queryKey: [key, src],
    queryFn: async () => {
      if (!src) return {};
      const response = await request.get(buildUrl(url, { src: src }));
      // Create a URL for the blob
      try {
        return URL.createObjectURL(response.data);
      } catch (error) {
        console.error(error);
      }
    },
    onError: (error) => {
      console.error(error);
      setAlert({
        severity: 'info',
        message: 'Failed to fetch image',
      });
    },
  });
};
