import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Api, invalidateQueryKeys } from '../../globals/api';
import { URL_INV_VIEW_KITS } from '../../globals/urls';
import { AlertContext } from '../../providers/AlertProvider';
import { getRequest } from '../../utils/getRequest';

export const useReturnKit = (options) => {
  const key = 'returnKit';
  const url = Api[key];
  const request = getRequest();
  const queryClient = useQueryClient();
  const { setAlert } = useContext(AlertContext);
  const [kitId, setKitId] = useState(null);
  const navigate = useNavigate();

  const defaultOptions = {
    onSuccess: () => {
      navigate(URL_INV_VIEW_KITS);
      invalidateQueryKeys({ id: kitId })[key].forEach((key) =>
        queryClient.invalidateQueries(key),
      );

      setAlert({
        severity: 'success',
        message: 'Successfully returned and updated kit!',
        autoHide: true,
      });
    },
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

  return useMutation({
    mutationFn: async (data) => {
      setKitId(data.kit_id);
      const response = await request.post(url, data);
      if (response.status != 200) throw new Error(response.statusText);
      return response.data;
    },
    ...defaultOptions,
    ...options,
  });
};
