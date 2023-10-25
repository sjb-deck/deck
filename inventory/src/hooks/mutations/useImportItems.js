import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';

import { Api } from '../../globals';
import { AlertContext } from '../../providers';
import { getRequest } from '../../../items/src/utils/getRequest';

export const useImportItems = (options) => {
  const key = 'importItems';
  const url = Api[key];
  const request = getRequest();
  const { setAlert } = useContext(AlertContext);
  const defaultOptions = {
    onError: (error) => {
      console.error(error.response.data.message);
      setAlert('error', error.message, false);
    },
  };

  return useMutation(
    async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await request.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status != 201) throw new Error(response.statusText);

      return response.data;
    },
    { ...defaultOptions, ...options },
  );
};
