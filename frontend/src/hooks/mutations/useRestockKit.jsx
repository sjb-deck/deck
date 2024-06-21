import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Api } from '../../globals/api';
import { URL_INV_VIEW_KITS } from '../../globals/urls';
import { AlertContext } from '../../providers/AlertProvider';
import { getRequest } from '../../utils/getRequest';

export const useRestockKit = (options) => {
  const key = 'kitRestock';
  const url = Api[key];
  const request = getRequest();
  const queryClient = useQueryClient();
  const { setAlert } = useContext(AlertContext);
  const [kitId, setKitId] = useState(null);
  const navigate = useNavigate();
  const defaultOptions = {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['kitRestockOptions', kitId]);
      queryClient.invalidateQueries(['kit', { kitId: kitId }]);
      navigate(URL_INV_VIEW_KITS);
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

  return useMutation({
    mutationFn: async (data) => {
      setKitId(data.kit_id);
      const response = await request.post(url, data);

      return response.data;
    },
    ...defaultOptions,
    ...options,
  });
};
