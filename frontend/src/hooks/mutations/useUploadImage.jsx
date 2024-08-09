import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';

import { AlertContext } from '../../providers';

export const useUploadImage = (options) => {
  const { setAlert } = useContext(AlertContext);

  return useMutation({
    mutationFn: async ({ presignedUrl, file }) => {
      const response = await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
      return response.data;
    },
    ...options,
    onError: (error) => {
      console.error(error);
      setAlert({
        severity: 'info',
        message: 'There was an error uploading the image. Please try again.',
        autoHide: true,
        additionalInfo: error.response?.data?.message,
      });
    },
  });
};
