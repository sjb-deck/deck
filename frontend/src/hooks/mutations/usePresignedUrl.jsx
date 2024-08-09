import { useMutation } from '@tanstack/react-query';

import { Api } from '../../globals/api';
import { getRequest } from '../../utils';

export const usePresignedUrl = (options) => {
  const key = 'presignedUrl';
  const url = Api[key];
  const request = getRequest();

  return useMutation({
    mutationFn: async ({ fileName, fileType, folderName }) => {
      const response = await request.post(url, {
        fileName: fileName,
        fileType: fileType,
        folderName: folderName,
      });
      return response.data;
    },
    cacheTime: 0, // Don't cache this mutation, each presigned URL should be unique
    ...options,
  });
};
