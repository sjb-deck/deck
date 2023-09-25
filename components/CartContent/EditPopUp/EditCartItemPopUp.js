import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Avatar,
  Backdrop,
  Button,
  Fade,
  InputAdornment,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import { CartContext } from '../../../providers';

import { getValidationSchema } from './getValidationSchema';
import { PopupStack } from './styled';

export const EditCartItemPopUp = ({ cartItem, open, handleClose }) => {
  const { editCartItemQuantity } = useContext(CartContext);

  const formik = useFormik({
    initialValues: {
      quantity: cartItem.cartQuantity,
    },
    enableReinitialize: true,
    validationSchema: getValidationSchema(cartItem),
    onSubmit: async (values) => {
      editCartItemQuantity(cartItem.expiryId, values.quantity);
      onClose();
    },
  });

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  const getExpiryDate = () => {
    const expiryId = cartItem.expiryId;
    return (
      cartItem.expiry_dates.find((expiry) => expiry.id == expiryId)
        .expiry_date ?? 'No Expiry'
    );
  };

  return (
    <Modal
      aria-labelledby='keep-mounted-modal-title'
      aria-describedby='keep-mounted-modal-description'
      open={open}
      onClose={onClose}
      slots={{ backdrop: Backdrop }}
    >
      <Fade in={open}>
        <PopupStack spacing={2}>
          {cartItem.imgpic ? (
            <Avatar
              alt={`${cartItem.name}`}
              src={`${cartItem.imgpic}`}
              sx={{ width: 90, height: 90 }}
            />
          ) : (
            <img src='/static/inventory/img/logo.png' width={90} height={90} />
          )}
          <Typography id='transition-modal-title' variant='h4' component='h2'>
            {cartItem.name}
          </Typography>
          <TextField
            id='filled-select-expiry-date'
            disabled={true}
            label='Expiry Date'
            value={getExpiryDate()}
            variant='filled'
            sx={{ width: '80%' }}
          />
          <TextField
            id='filled-basic'
            type='number'
            label='Quantity'
            variant='filled'
            name='quantity'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>{cartItem.unit}</InputAdornment>
              ),
            }}
            sx={{ width: '80%' }}
            {...formik.getFieldProps('quantity')}
            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
            helperText={formik.touched.quantity && formik.errors.quantity}
          />
          <Button
            variant='contained'
            role='submit-button'
            color={cartItem.type == 'Deposit' ? 'success' : 'error'}
            endIcon={<CheckCircleIcon />}
            onClick={formik.handleSubmit}
          >
            Save Changes
          </Button>
        </PopupStack>
      </Fade>
    </Modal>
  );
};

EditCartItemPopUp.propTypes = {
  cartItem: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
