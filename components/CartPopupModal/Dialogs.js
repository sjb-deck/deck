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
import React, { useState } from 'react';

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

export function DatePickerDialog({ openDatePicker, handleCloseDatePicker }) {
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format('YYYY-MM-DD'),
  );

  const MyActionBar = () => {
    return (
      <DialogActions>
        <Button onClick={() => handleCloseDatePicker(null)}>Cancel</Button>
        <Button onClick={() => handleCloseDatePicker(selectedDate)}>Ok</Button>
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
      <DialogContent sx={{ padding: '0px' }}>
        <StaticDatePicker
          minDate={dayjs()}
          defaultValue={dayjs()}
          value={dayjs(selectedDate)}
          onChange={(value) =>
            setSelectedDate(dayjs(value.$d).format('YYYY-MM-DD'))
          }
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
};
