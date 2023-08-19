import { useMutation } from '@tanstack/react-query';

import { Api } from '../../globals';
import { AlertContext } from '../../providers';
import { getRequest } from '../../utils/getRequest';

export const useAddItem = (options) => {
  const key = 'addItem';
  const url = Api[key];
  const request = getRequest();

  return useMutation(
    async (order) => {
      const response = request.post(url, order);
      return response.data;
    },
  );
};
