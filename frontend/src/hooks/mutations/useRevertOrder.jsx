import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useState } from 'react';

import { Api, invalidateQueryKeys } from '../../globals/api';
import { AlertContext } from '../../providers';
import { getRequest } from '../../utils';

export const useRevertOrder = (options) => {
  const key = 'revertOrder';
  const url = Api[key];
  const request = getRequest();
  const queryClient = useQueryClient();
  const [id, setId] = useState();
  const { setAlert } = useContext(AlertContext);
  const defaultOptions = {
    onSuccess: async () => {
      invalidateQueryKeys({ id: id })[key].forEach((key) =>
        queryClient.invalidateQueries(key),
      );
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
    mutationFn: async (id) => {
      setId(id);
      const response = await request.post(url, { id: id });
      if (response.status != 200) throw new Error(response.statusText);
      return response.data;
    },
    ...defaultOptions,
    ...options,
  });
};
