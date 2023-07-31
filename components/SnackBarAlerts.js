import { Alert, Snackbar } from '@mui/material';
import { PropTypes } from 'prop-types';
import React from 'react';

/**
 * A feedback message that appears as a snackbar at the bottom left of the screen
 * providing user with a feedback message after an action is performed
 *
 * @param {severity} severity - The severity of the feedback message, decides the colour of the snackbar
 * @param {message} message - The message to be displayed
 * @param {open} open - A boolean value that determines whether the snackbar is open or not
 * @returns A snackbar that appears at the bottom left of the screen
 */

export const SnackBarAlerts = ({
  severity = 'error',
  message,
  open,
  onClose,
  autoHide = true,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={open}
      autoHideDuration={autoHide ? 10000 : null}
      onClose={onClose}
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
  onClose: PropTypes.func,
  autoHide: PropTypes.bool,
};
