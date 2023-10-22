import { useMutation } from '@tanstack/react-query';

import { Api } from '../../globals';
import { getRequest } from '../../utils/getRequest';

export const useReturnLoan = (options) => {
  const key = 'returnLoan';
  const url = Api[key];
  const request = getRequest();

  return useMutation(async (order) => {
    const response = await request.post(url, order);
    return response.data;
  });
};
