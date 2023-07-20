import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  Typography,
  Paper,
  LinearProgress,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import {
  checkLoanReturnForm,
  submitLoanReturn,
} from '../../utils/submitLoanForm';

const ReturnForm = ({ items, id, onClose, open }) => {
  const [quantities, setQuantities] = useState(
    items.map(() => ({ quantityOpened: 0, quantityUnopened: 0 })),
  );
  const [errors, setErrors] = useState(
    items.map(() => ({ quantityOpened: false, quantityUnopened: false })),
  );
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (index, field, value) => {
    setQuantities((prevQuantities) => {
      const updatedQuantities = [...prevQuantities];
      updatedQuantities[index][field] = value;
      return updatedQuantities;
    });
  };

  const handleFormSubmit = () => {
    setLoading(true);
    if (checkLoanReturnForm(items, quantities, setErrors)) {
      submitLoanReturn(items, quantities, id, setLoading);
    } else {
      setLoading(false);
      console.log('Error: Loan return form is invalid');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Return Form</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid item={true} xs={12} key={index}>
              <Paper key={index} sx={{ padding: '15px' }}>
                <DialogContentText>
                  <Typography variant='body1' component='span'>
                    {item.name}
                  </Typography>
                </DialogContentText>
                <Typography
                  variant='caption'
                  component='span'
                  sx={{ color: '#666' }}
                >
                  {' (Expiry: ' +
                    (item.expiry ? item.expiry : 'N/A') +
                    ', Unit: ' +
                    item.unit +
                    ')'}
                </Typography>
                <Grid container spacing={2} sx={{ marginTop: '2px' }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label='Returning Opened'
                      type='number'
                      value={quantities[index].quantityOpened}
                      onChange={(event) =>
                        handleQuantityChange(
                          index,
                          'quantityOpened',
                          event.target.value,
                        )
                      }
                      variant='standard'
                      sx={{
                        '& .MuiInputLabel-root': {
                          color: errors[index].quantityOpened ? 'red' : 'white',
                        },
                        '& .MuiFormLabel-root': {
                          color: errors[index].quantityOpened ? 'red' : 'white',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label='Returning Unopened'
                      type='number'
                      value={quantities[index].quantityUnopened}
                      onChange={(event) =>
                        handleQuantityChange(
                          index,
                          'quantityUnopened',
                          event.target.value,
                        )
                      }
                      variant='standard'
                      sx={{
                        '& .MuiInputLabel-root': {
                          color: errors[index].quantityUnopened
                            ? 'red'
                            : 'white',
                        },
                        '& .MuiFormLabel-root': {
                          color: errors[index].quantityUnopened
                            ? 'red'
                            : 'white',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          size='small'
          disabled={loading}
          color='primary'
          sx={{ marginBottom: '10px' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleFormSubmit}
          size='small'
          disabled={loading}
          variant='contained'
          color='primary'
          sx={{ marginRight: '20px', marginBottom: '10px' }}
        >
          Submit
        </Button>
      </DialogActions>
      <LinearProgress hidden={!loading} />
    </Dialog>
  );
};

ReturnForm.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      expiry: PropTypes.string,
      type: PropTypes.string,
      quantity_opened: PropTypes.number.isRequired,
      quantity_unopened: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
      imgpic: PropTypes.string,
    }),
  ).isRequired,
  id: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ReturnForm;
