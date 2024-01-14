import React from 'react';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ConfirmationTable } from './ConfirmationTable';

export const ConfirmationModal = ({ data, openConfirm, closeDialog }) => {
  console.log('MODAL BUILD', data);
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
        <ConfirmationTable dataShown={data} />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button onClick={closeDialog}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};
