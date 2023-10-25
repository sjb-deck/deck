import { useMutation } from '@tanstack/react-query';

import { Api } from '../../globals';
import { getRequest } from '../../../items/src/utils/getRequest';

export const useAddItem = (options) => {
  const key = 'addItem';
  const url = Api[key];
  const request = getRequest();

  return useMutation(async (order) => {
    const response = await request.post(url, order);
    return response.data;
  });
};
