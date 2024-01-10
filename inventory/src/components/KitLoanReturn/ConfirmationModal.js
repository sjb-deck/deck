import React from 'react';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

export const ConfirmationModal = ({ openConfirm, closeDialog }) => {
  const headerText = 'Confirm Loan Return';
  return (
    <Dialog
      open={openConfirm}
      onClose={closeDialog}
      scroll={'paper'}
      aria-labelledby='scroll-dialog-title'
      aria-describedby='scroll-dialog-description'
    >
      <DialogTitle id='scroll-dialog-title'>{headerText}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel
          scelerisque nisl consectetur et.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button onClick={closeDialog}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};
