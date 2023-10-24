import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';

import { Api } from '../../globals';
import { AlertContext } from '../../providers';

export const useExportItems = (options) => {
  const key = 'exportItems';
  const url = Api[key];
  const { setAlert } = useContext(AlertContext);
  const defaultOptions = {
    onError: (error) => {
      console.error(error.response?.data?.message);
      setAlert({
        severity: 'error',
        message: error.message,
        autoHide: false,
        additionalInfo: error.response?.data?.message,
      });
    },
  };

  return useMutation(
    async () => {
      const response = await axios.get(url, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', downloadUrl);
      a.setAttribute('download', 'items.csv');
      a.click();
      window.URL.revokeObjectURL(url);

      if (response.status != 200) throw new Error(response.statusText);

      return response.data;
    },
    { ...defaultOptions, ...options },
  );
};
