import { Alert } from '@mui/material';
import React from 'react';

export const ErrorMessage = ({ message }) => {
  return (
    <Alert variant='filled' severity='error'>
      {message}
    </Alert>
  );
};
