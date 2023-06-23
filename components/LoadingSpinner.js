import { Box, CircularProgress } from '@mui/material';
import React from 'react';

import Theme from './Themes';

export const LoadingSpinner = () => {
  return (
    <Theme>
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    </Theme>
  );
};
