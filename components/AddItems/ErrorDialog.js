import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import React from 'react';

const ERROR_MESSAGE =
  'An error occurred. Please inform Fabian Sir immediately and do not attempt to add anything else.';

const ErrorDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ color: 'red', fontSize: '18px', fontWeight: 'bold' }}>
        Error!
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{ERROR_MESSAGE}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

ErrorDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ErrorDialog;
