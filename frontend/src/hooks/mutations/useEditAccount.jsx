import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Api } from '../../globals/api';
import { URL_BASE_INV } from '../../globals/urls';
import { AlertContext } from '../../providers';
import { getEnvironment, getRequest } from '../../utils';

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
        message: 'Successfully edited account details!',
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
      const presignedResponse = await getPresignedUrl({
        fileName: data.image.name,
        fileType: data.image.type,
        folderName: getEnvironment() === 'prod' ? 'prod' : 'staging',
      });
      const presignedUrl = presignedResponse.url;
      uploadImage({ presignedUrl, file: data.image });

      const response = await request.post(url, {
        ...data,
        image: data.image.name,
      });

      return response.data;
    },
    ...defaultOptions,
    ...options,
  });
};
