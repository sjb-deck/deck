import { Backdrop, Box, CircularProgress } from '@mui/material';

export const LoadingSpinner = () => {
  return (
    <Backdrop open={true} sx={{ position: 'absolute', zIndex: 500 }}>
      <Box data-testid='loading-spinner'>
        <CircularProgress />
      </Box>
    </Backdrop>
  );
};
