import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api, invalidateQueryKeys } from '../../globals/api';
import { getEnvironment } from '../../utils';
import { getRequest } from '../../utils/getRequest';

import { usePresignedUrl } from './usePresignedUrl';
import { useUploadImage } from './useUploadImage';

export const useAddItem = (options) => {
  const key = 'addItem';
  const url = Api[key];
  const queryClient = useQueryClient();
  const request = getRequest();
  const { mutateAsync: getPresignedUrl } = usePresignedUrl();
  const { mutateAsync: uploadImage } = useUploadImage();

  return useMutation({
    mutationFn: async (order) => {
      // if image is provided, upload it to S3
      if (order.imgpic.name) {
        // get presigned URL
        const presignedResponse = await getPresignedUrl({
          fileName: order.imgpic.name,
          fileType: order.imgpic.type,
          folderName: getEnvironment() === 'prod' ? 'prod' : 'staging',
        });
        const presignedUrl = presignedResponse.url;
        // upload image to S3 using presigned URL
        uploadImage({ presignedUrl, file: order.imgpic });
      }
      const response = await request.post(url, {
        ...order,
        imgpic: order.imgpic.name,
      });
      return response.data;
    },
    ...options,
    onSuccess: () => {
      invalidateQueryKeys()[key].forEach((key) =>
        queryClient.invalidateQueries(key),
      );
    },
  });
};
