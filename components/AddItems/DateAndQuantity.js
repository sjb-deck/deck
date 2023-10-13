import { Button, Grid, TextField, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';

export const DateAndQuantity = ({
  expiryFormData,
  setExpiryFormData,
  expiryFormError,
  setExpiryFormError,
  index,
}) => {
  const isSmallScreen = useMediaQuery('(max-width: 300px)');
  const firstItem = index === 0;
  const expiryDate = expiryFormData.expiry[index].expiry_date;
  const quantity = expiryFormData.expiry[index].quantity;

  const handleDateChange = (newDate) => {
    const exp = expiryFormData.expiry;
    const err = expiryFormError.expiry;
    exp[index].expiry_date = dayjs(newDate).format('YYYY-MM-DD');
    err[index].expiry_date = false;
    setExpiryFormData((prev) => ({
      ...prev,
      expiry: exp,
    }));
    setExpiryFormError((prev) => ({
      ...prev,
      expiry: err,
    }));
  };

  const handleFormChange = (event) => {
    const { value } = event.target;
    const exp = expiryFormData.expiry;
    const err = expiryFormError.expiry;
    exp[index].quantity = value;
    err[index].quantity = false;
    setExpiryFormData((prev) => ({
      ...prev,
      expiry: exp,
    }));
    setExpiryFormError((prev) => ({
      ...prev,
      expiry: err,
    }));
  };

  const handleRemoveExpiry = () => {
    const exp = expiryFormData.expiry;
    const err = expiryFormError.expiry;
    exp.splice(index, 1);
    err.splice(index, 1);
    setExpiryFormData((prev) => ({
      ...prev,
      expiry: exp,
    }));
    setExpiryFormError((prev) => ({
      ...prev,
      expiry: err,
    }));
  };

  return (
    <div>
      <Box
        sx={{
          outline: '1px solid gray',
          padding: '10px',
          position: 'relative',
        }}
      >
        <Typography
          sx={{
            position: 'absolute',
            top: '10px',
            right: '15px',
          }}
        >
          {index + 1}
        </Typography>
        <Grid
          container
          spacing={3}
          alignItems='flex-end'
          sx={{ paddingTop: '10px' }}
        >
          <Grid item xs={isSmallScreen ? 12 : 8} sm={8}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                defaultValue={dayjs(expiryDate)}
                onChange={(date) => handleDateChange(date)}
                sx={{ paddingTop: '10px', paddingLeft: '15px' }}
                minDate={dayjs()}
                label='Expiry Date'
              />
              <Typography
                sx={{
                  fontSize: '12px',
                  paddingLeft: '15px',
                  paddingTop: '3px',
                  color: expiryFormError.expiry[index].expiry_date
                    ? 'red'
                    : 'gray',
                }}
              >
                {expiryFormError.expiry[index].expiry_date
                  ? 'Item expires today or is a duplicate!'
                  : 'Expiry date of item'}
              </Typography>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={isSmallScreen ? 12 : 4} sm={4}>
            {expiryFormData.expiry.length === 1 ? null : (
              <Button
                variant='outlined'
                size='small'
                color='error'
                onClick={handleRemoveExpiry}
                sx={{ fontSize: '10px', marginBottom: '20px' }}
              >
                Remove
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ padding: '10px' }}>
          <Grid item xs={isSmallScreen ? 12 : 6} sm={6}>
            <TextField
              label='Quantity'
              name='quantity'
              value={quantity}
              onChange={handleFormChange}
              type='number'
              helperText={
                expiryFormError.expiry[index].quantity
                  ? 'Quantity must be a non-negative number!'
                  : firstItem
                  ? 'Quantity of open item for all expiries'
                  : ''
              }
              variant='standard'
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  color: expiryFormError.expiry[index].quantity
                    ? 'red'
                    : 'white',
                },
                '& .MuiFormHelperText-root': {
                  color: expiryFormError.expiry[index].quantity
                    ? 'red'
                    : 'gray',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

DateAndQuantity.propTypes = {
  expiryFormData: PropTypes.shape({
    expiry: PropTypes.arrayOf(
      PropTypes.shape({
        expiry_date: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  setExpiryFormData: PropTypes.func.isRequired,
  expiryFormError: PropTypes.shape({
    expiry: PropTypes.arrayOf(
      PropTypes.shape({
        expiry_date: PropTypes.bool.isRequired,
        quantity: PropTypes.bool.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  setExpiryFormError: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};
