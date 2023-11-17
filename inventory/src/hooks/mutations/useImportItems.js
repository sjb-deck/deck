import { useMutation } from '@tanstack/react-query';

import { Api } from '../../globals';
import { getRequest } from '../../utils/getRequest';

export const useImportItems = (options) => {
  const key = 'importItems';
  const url = Api[key];
  const request = getRequest();
  const defaultOptions = {
    onError: (error) => {
      alert(
        'There seems to be an error in processing your CSV. Please check the format and try again.',
      );
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
