import { Alert, AlertTitle, Backdrop, Typography } from '@mui/material';
import React from 'react';

export const ErrorPopup = ({ open, message, additionalInfo }) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer * 2 }}
      open={open}
    >
      <Alert variant='filled' severity='error' sx={{ maxWidth: '90%' }}>
        <AlertTitle>Whoops! Something went wrong</AlertTitle>
        <Typography>We are unable to process this request!</Typography>

        <Typography marginTop={3}>Error Message:</Typography>
        <Typography variant='overline' gutterBottom>
          {message}
        </Typography>
        {additionalInfo && (
          <>
            <Typography marginTop={3}>Backend Response:</Typography>
            <Typography variant='overline' gutterBottom>
              {additionalInfo}
            </Typography>
          </>
        )}

        <Typography marginTop={3}>Actions:</Typography>
        <Typography variant='overline' gutterBottom>
          Report this event and reload the page.
        </Typography>
      </Alert>
    </Backdrop>
  );
};
