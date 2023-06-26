import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

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
