import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Api } from '../../globals/api';
import { URL_BASE_INV } from '../../globals/urls';
import { AlertContext } from '../../providers';
import { getRequest } from '../../utils';

import { usePresignedUrl } from './usePresignedUrl';
import { useUploadImage } from './useUploadImage';

export const useEditAccount = (options) => {
  const key = 'edit';
  const url = Api[key];
  const request = getRequest();
  const queryClient = useQueryClient();
  const { setAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  const { mutateAsync: getPresignedUrl } = usePresignedUrl();
  const { mutateAsync: uploadImage } = useUploadImage();

  const defaultOptions = {
    onSuccess: () => {
      setAlert({
        severity: 'success',
        message: 'Successful! Re-login to see changes',
        autoHide: true,
      });
      queryClient.invalidateQueries('user');
      navigate(URL_BASE_INV);
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
      if (data.image.name) {
        const presignedResponse = await getPresignedUrl({
          fileName: data.image.name,
          fileType: data.image.type,
          folderName: 'user_dp',
        });
        const presignedUrl = presignedResponse.url;
        uploadImage({ presignedUrl, file: data.image });
      }

      const response = await request.post(url, {
        ...data,
        image: data.image.name ? 'user_dp/' + data.image.name : null,
      });

      return response.data;
    },
    ...defaultOptions,
    ...options,
  });
};
