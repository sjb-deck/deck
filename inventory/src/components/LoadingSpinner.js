import { Backdrop, Box, CircularProgress } from '@mui/material';
import React from 'react';

export const LoadingSpinner = () => {
  return (
    <Backdrop open={true} sx={{ position: 'absolute' }}>
      <Box data-testid='loading-spinner'>
        <CircularProgress />
      </Box>
    </Backdrop>
  );
};
