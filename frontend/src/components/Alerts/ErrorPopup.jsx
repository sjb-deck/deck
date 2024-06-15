import { Alert, AlertTitle, Backdrop, Box, Typography } from '@mui/material';

export const ErrorPopup = ({ open, message, additionalInfo }) => {
  const handleClose = () => {
    window.location.reload();
  };

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer * 2 }}
      open={open}
      onClick={handleClose}
    >
      <Alert variant='filled' severity='error' sx={{ maxWidth: '90%' }}>
        <AlertTitle>Whoops! Something went wrong</AlertTitle>
        <Typography>We are unable to process this request!</Typography>

        <Typography marginTop={3}>Error Message:</Typography>
        <Box maxHeight={'25vh'} overflow={'scroll'}>
          <Typography variant='overline' gutterBottom>
            {message}
          </Typography>
        </Box>
        {additionalInfo && (
          <>
            <Typography marginTop={3}>Backend Response:</Typography>
            <Box maxHeight={'25vh'} overflow={'scroll'}>
              <Typography variant='overline' gutterBottom>
                {additionalInfo}
              </Typography>
            </Box>
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
