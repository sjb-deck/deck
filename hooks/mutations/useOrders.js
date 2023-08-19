import { useMutation } from '@tanstack/react-query';

import { Api } from '../../globals';
import { AlertContext } from '../../providers';
import { getRequest } from '../../utils/getRequest';

export const useOrders = (options) => {
  const key = 'submitOrder';
  const url = Api[key];
  const request = getRequest();
  const { setAlert } = useContext(AlertContext);
  const defaultOptions = {
    onSuccess: () => {
      setAlert('success', 'Order submitted successfully!', true);
      queryClient.invalidateQueries('items');
    },
    onError: (error) => {
      console.error(error);
      setAlert('error', error.message, false);
    },
  };

  return useMutation(
    async (order) => {
      const response = await request.post(url, order);

      if (response.status != 200) throw new Error(response.statusText);

      return response.data;
    },
    { ...defaultOptions, ...options },
  );
};
