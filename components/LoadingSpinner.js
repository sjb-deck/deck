import { Box, CircularProgress } from '@mui/material';
import React from 'react';

export const LoadingSpinner = () => {
  return (
    <Box
      data-testid='loading-spinner'
      sx={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  );
};
