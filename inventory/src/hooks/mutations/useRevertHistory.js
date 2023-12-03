import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

import { Api } from '../../globals';
import { AlertContext } from '../../providers';
import { getRequest } from '../../utils/getRequest';

export const useRevertHistory = (options) => {
  const key = 'revertHistory';
  const request = getRequest();
  const queryClient = useQueryClient();
  const { setAlert } = useContext(AlertContext);
  const defaultOptions = {
    onSuccess: async () => await queryClient.invalidateQueries('kitHistory'),
    onError: (error) => {
      if (
        error.response?.data?.message ===
        'This is not the latest operation of the kit and cannot be reverted.'
      ) {
        alert(
          'This is not the latest operation of the kit and cannot be reverted.',
        );
        return;
      }
      setAlert({
        severity: 'error',
        message: error.message,
        autoHide: false,
        additionalInfo: error.response?.data?.message,
      });
    },
  };

  return useMutation(
    async (historyId) => {
      const url = Api[key].replace(':id', historyId);
      const response = await request.get(url);
      if (response.status != 200) throw new Error(response.statusText);
      return response.data;
    },
    { ...defaultOptions, ...options },
  );
};
