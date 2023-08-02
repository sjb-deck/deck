import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs from 'dayjs';
import { PropTypes } from 'prop-types';
import React from 'react';

export function ConfirmationDialog({
  openConfirmation,
  handleCloseConfirmation,
  handleSubmit,
}) {
  return (
    <Dialog
      open={openConfirmation}
      onClose={handleCloseConfirmation}
      aria-labelledby='responsive-dialog-title'
    >
      <DialogTitle id='responsive-dialog-title'>
        Proceed to deposit item?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          For new expiry date, the deposit will take effect immediately once you
          submit and will hence not be added to your cart. Do you still wish to
          submit?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCloseConfirmation}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleSubmit();
            handleCloseConfirmation();
          }}
          autoFocus
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function DatePickerDialog({
  openDatePicker,
  handleCloseDatePicker,
  updateTempSelectedDate,
}) {
  const MyActionBar = () => {
    return (
      <DialogActions>
        <Button onClick={() => handleCloseDatePicker('close')}>Cancel</Button>
        <Button onClick={() => handleCloseDatePicker('updateDate')}>Ok</Button>
      </DialogActions>
    );
  };
  return (
    <Dialog
      open={openDatePicker}
      onClose={() => handleCloseDatePicker('close')}
      aria-labelledby='responsive-dialog-title'
    >
      <DialogTitle id='responsive-dialog-title'>
        Pick a new expiry date
      </DialogTitle>
      <DialogContent>
        <StaticDatePicker
          minDate={dayjs()}
          defaultValue={dayjs()}
          onChange={(value) => updateTempSelectedDate(value)}
          slotProps={{
            layout: {
              sx: {
                display: 'flex',
                flexDirection: 'column',
              },
            },
          }}
          slots={{
            actionBar: MyActionBar,
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {
  openConfirmation: PropTypes.bool.isRequired,
  handleCloseConfirmation: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

DatePickerDialog.propTypes = {
  openDatePicker: PropTypes.bool.isRequired,
  handleCloseDatePicker: PropTypes.func.isRequired,
  updateTempSelectedDate: PropTypes.func.isRequired,
};
