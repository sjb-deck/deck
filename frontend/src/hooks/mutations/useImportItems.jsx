import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

import { Api, invalidateQueryKeys } from '../../globals/api';
import { AlertContext } from '../../providers/AlertProvider';
import { getRequest } from '../../utils/getRequest';

export const useImportItems = (options) => {
  const key = 'importItems';
  const url = Api[key];
  const request = getRequest({
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  const { setAlert } = useContext(AlertContext);
  const queryClient = useQueryClient();
  const defaultOptions = {
    onError: (error) => {
      setAlert({
        severity: 'error',
        message: error.message,
        autoHide: false,
        additionalInfo: error.response?.data?.message,
      });
    },
    onSuccess: () => {
      setAlert({
        severity: 'success',
        message: 'Successfully imported items!',
        autoHide: true,
      });
      invalidateQueryKeys()[key].forEach((key) =>
        queryClient.invalidateQueries(key),
      );
    },
  };

  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await request.post(url, formData);
      if (response.status != 201) throw new Error(response.statusText);
      return response.data;
    },
    ...defaultOptions,
    ...options,
  });
};
