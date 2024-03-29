import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useState } from 'react';

import { Api } from '../../globals';
import { AlertContext } from '../../providers';
import { getRequest } from '../../utils/getRequest';

export const useRestockKit = (options) => {
  const key = 'kitRestock';
  const url = Api[key];
  const request = getRequest();
  const queryClient = useQueryClient();
  const { setAlert } = useContext(AlertContext);
  const [kitId, setKitId] = useState(null);
  const defaultOptions = {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['kitRestockOptions', kitId]);
      queryClient.invalidateQueries(['kit', { kitId: kitId }]);
      window.location.href = '/inventory/kits';
    },
    onError: (error) => {
      console.log(error);
      setAlert({
        severity: 'error',
        message: error.message,
        autoHide: false,
        additionalInfo: error.response?.data?.message,
      });
    },
  };

  return useMutation(
    async (data) => {
      setKitId(data.kit_id);
      const response = await request.post(url, data);

      return response.data;
    },
    { ...defaultOptions, ...options },
  );
};
