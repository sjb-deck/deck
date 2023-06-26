import { Alert, Snackbar } from '@mui/material';
import { PropTypes } from 'prop-types';
import React from 'react';

export const SnackBarAlerts = ({ severity = 'error', message, open }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={open}
      autoHideDuration={6000}
    >
      <Alert severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

SnackBarAlerts.propTypes = {
  severity: PropTypes.string,
  message: PropTypes.string,
  open: PropTypes.bool.isRequired,
};
