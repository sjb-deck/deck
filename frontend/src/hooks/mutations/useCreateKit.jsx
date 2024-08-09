import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

import { Api, invalidateQueryKeys } from '../../globals/api';
import { AlertContext } from '../../providers';
import { getRequest } from '../../utils';

export const useCreateKit = (options) => {
  const key = 'createKit';
  const url = Api[key];
  const request = getRequest();
  const queryClient = useQueryClient();
  const { setAlert } = useContext(AlertContext);
  const defaultOptions = {
    onSuccess: () => {
      setAlert({
        severity: 'success',
        message: 'Successfully created kit!',
        autoHide: true,
      });
      invalidateQueryKeys()[key].forEach((key) =>
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
    mutationFn: async (kit) => {
      const response = await request.post(url, kit);

      if (response.status != 201) throw new Error(response.statusText);

      return response.data;
    },
    ...defaultOptions,
    ...options,
  });
};
