import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Api, invalidateQueryKeys } from '../../globals/api';
import { getRequest } from '../../utils/getRequest';

export const useReturnLoan = (options) => {
  const key = 'returnLoan';
  const url = Api[key];
  const request = getRequest();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order) => {
      const response = await request.post(url, order);
      return response.data;
    },
    onSuccess: () => {
      invalidateQueryKeys()[key].forEach((key) =>
        queryClient.invalidateQueries(key),
      );
    },
  });
};
