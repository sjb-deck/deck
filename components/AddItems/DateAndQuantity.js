import React from 'react';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Button, Grid, TextField, useMediaQuery } from '@mui/material';
import Typography from '@mui/material/Typography';

const DateAndQuantity = ({
  expiryFormData,
  setExpiryFormData,
  expiryFormError,
  setExpiryFormError,
  index,
}) => {
  const isSmallScreen = useMediaQuery('(max-width: 300px)');
  const firstItem = index === 0;
  const date = expiryFormData.expiry[index].date;
  const totalQuantityopen = expiryFormData.expiry[index].total_quantityopen;
  const totalQuantityunopened =
    expiryFormData.expiry[index].total_quantityunopened;

  const handleDateChange = (newDate) => {
    const exp = expiryFormData.expiry;
    const err = expiryFormError.expiry;
    exp[index].date = dayjs(newDate).format('YYYY-MM-DD');
    err[index].date = false;
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
    const { name, value } = event.target;
    const exp = expiryFormData.expiry;
    const err = expiryFormError.expiry;
    exp[index][name] = value;
    err[index].total_quantityopen = false;
    err[index].total_quantityunopened = false;
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
        <Grid container spacing={3} alignItems='flex-end'>
          <Grid item xs={isSmallScreen ? 12 : 8} sm={8}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                defaultValue={dayjs(date)}
                onChange={(date) => handleDateChange(date)}
                sx={{ paddingTop: '10px', paddingLeft: '15px' }}
                minDate={dayjs()}
              />
              <Typography
                sx={{
                  fontSize: '12px',
                  paddingLeft: '15px',
                  paddingTop: '3px',
                  color: expiryFormError.expiry[index].date ? 'red' : 'gray',
                }}
              >
                {expiryFormError.expiry[index].date
                  ? 'Expires today or is a duplicate!'
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
              label='Total Quantity (Open)'
              name='total_quantityopen'
              value={totalQuantityopen}
              onChange={handleFormChange}
              type='number'
              helperText={
                expiryFormError.expiry[index].total_quantityopen
                  ? 'Quantity must be a non-negative number!'
                  : firstItem
                  ? 'Quantity of open item for all expiries'
                  : ''
              }
              variant='standard'
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  color: expiryFormError.expiry[index].total_quantityopen
                    ? 'red'
                    : 'white',
                },
                '& .MuiFormHelperText-root': {
                  color: expiryFormError.expiry[index].total_quantityopen
                    ? 'red'
                    : 'gray',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>
          <Grid item xs={isSmallScreen ? 12 : 6} sm={6}>
            <TextField
              label='Total Quantity (Unopened)'
              name='total_quantityunopened'
              value={totalQuantityunopened}
              onChange={handleFormChange}
              type='number'
              helperText={
                expiryFormError.expiry[index].total_quantityunopened
                  ? 'Quantity must be a non-negative number!'
                  : firstItem
                  ? 'Quantity of unopened item for all expiries'
                  : ''
              }
              variant='standard'
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  color: expiryFormError.expiry[index].total_quantityunopened
                    ? 'red'
                    : 'white',
                },
                '& .MuiFormHelperText-root': {
                  color: expiryFormError.expiry[index].total_quantityunopened
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
        date: PropTypes.string.isRequired,
        total_quantityopen: PropTypes.number.isRequired,
        total_quantityunopened: PropTypes.number.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  setExpiryFormData: PropTypes.func.isRequired,
  expiryFormError: PropTypes.shape({
    expiry: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.bool.isRequired,
        total_quantityopen: PropTypes.bool.isRequired,
        total_quantityunopened: PropTypes.bool.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  setExpiryFormError: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default DateAndQuantity;
