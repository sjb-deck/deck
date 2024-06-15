import { useMutation } from '@tanstack/react-query';

import { Api } from '../../globals/api';
import { getRequest } from '../../utils/getRequest';

export const useAddItem = (options) => {
  const key = 'addItem';
  const url = Api[key];
  const request = getRequest({
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return useMutation({
    mutationFn: async (order) => {
      const formData = new FormData();
      for (const key in order) {
        if (order.hasOwnProperty(key)) {
          if (key === 'expiry_dates') {
            formData.append(key, JSON.stringify(order[key]));
            continue;
          }
          formData.append(key, order[key]);
        }
      }
      const response = await request.post(url, formData);
      return response.data;
    },
  });
};
