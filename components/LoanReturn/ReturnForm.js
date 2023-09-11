import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { URL_INV_LOAN_RETURN } from '../../globals';
import { useReturnLoan } from '../../hooks/mutations/useReturnLoan';
import { checkLoanReturnForm } from '../../utils';

export const ReturnForm = ({ items, id, onClose, open }) => {
  const [quantities, setQuantities] = useState(
    items.map(() => ({ returnQuantity: 0 })),
  );
  const [errors, setErrors] = useState(
    items.map(() => ({ returnQuantity: false })),
  );
  const [loading, setLoading] = useState(false);
  const { mutate } = useReturnLoan();

  const processReturnSubmission = () => {
    const payload = {
      order_id: id,
      items: [],
    };
    for (let i = 0; i < items.length; i++) {
      payload.items.push({
        order_item_id: items[i].item_expiry.id,
        returned_quantity: quantities[i].returnQuantity,
      });
    }
    mutate(payload, {
      onSuccess: () => {
        window.location.href = URL_INV_LOAN_RETURN;
      },
      onError: () => {
        setLoading(false);
      },
    });
  };

  const handleQuantityChange = (index, value) => {
    setQuantities((prevQuantities) => {
      const updatedQuantities = [...prevQuantities];
      updatedQuantities[index]['returnQuantity'] = value;
      return updatedQuantities;
    });
  };

  const handleFormSubmit = () => {
    setLoading(true);
    if (checkLoanReturnForm(items, quantities, setErrors)) {
      processReturnSubmission();
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
                <Grid
                  container
                  spacing={2}
                  sx={{ marginLeft: '2px', marginRight: '2px' }}
                >
                  <Grid item xs={6}>
                    <DialogContentText>
                      <Typography variant='body1' component='span'>
                        {item.item_expiry.item.name}
                      </Typography>
                    </DialogContentText>
                    <Typography
                      variant='caption'
                      component='span'
                      sx={{ color: '#666' }}
                    >
                      {' (Expiry: ' +
                        (item.item_expiry.expiry_date
                          ? item.item_expiry.expiry_date
                          : 'N/A') +
                        ', Unit: ' +
                        item.item_expiry.item.unit +
                        ')'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label='Returning Quantity'
                      type='number'
                      value={quantities[index].returnQuantity}
                      onChange={(event) =>
                        handleQuantityChange(index, event.target.value)
                      }
                      variant='standard'
                      sx={{
                        '& .MuiInputLabel-root': {
                          color: errors[index].returnQuantity ? 'red' : 'white',
                        },
                        '& .MuiFormLabel-root': {
                          color: errors[index].returnQuantity ? 'red' : 'white',
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
      id: PropTypes.number.isRequired,
      item_expiry: PropTypes.shape({
        item: PropTypes.shape({
          name: PropTypes.string.isRequired,
          unit: PropTypes.string.isRequired,
        }).isRequired,
        expiry_date: PropTypes.string,
      }).isRequired,
    }),
  ).isRequired,
  id: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
