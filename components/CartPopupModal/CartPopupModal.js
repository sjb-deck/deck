import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Fade,
  InputAdornment,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { PropTypes } from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import * as yup from 'yup';

import {
  CART_ITEM_TYPE_DEPOSIT,
  CART_ITEM_TYPE_WITHDRAW,
  ItemPropType,
} from '../../globals';
import { useNewExpiryDate } from '../../hooks/mutations';
import { CartContext } from '../../providers/CartProvider';
import { addToCart } from '../../utils/cart-utils/addToCart';
import { getCartState } from '../../utils/cart-utils/getCartState';
import { getMaxWithdrawalQty } from '../../utils/cart-utils/getMaxWithdrawalQty';
import { SnackBarAlerts } from '../SnackBarAlerts';

import { ConfirmationDialog, DatePickerDialog } from './Dialogs';

export const CartPopupModal = ({ type, item, selector, open, setOpen }) => {
  const hasExpiry = !!item.expiry_dates[0].expiry_date;
  const showDropdown = hasExpiry && item.expiry_dates.length > 1;
  const theme = useTheme();
  const preselectedExpiryId =
    selector == 'All'
      ? item.expiry_dates[0].id
      : item.expiry_dates.find((itemExpiry) => itemExpiry.id == selector).id;
  const { cartItems, setCartItems, setCartState } = useContext(CartContext);

  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  // const [openDepositResponse, setOpenDepositResponse] = useState(false);
  // const [responseMsg, setResponseMsg] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [tempSelectedDate, setTempSelectedDate] = useState('');
  const [itemExpiryDates, setItemExpiryDates] = useState([]);
  const [selectedExpiryId, setSelectedExpiryId] = useState(preselectedExpiryId);
  const [maxTotalQty, setMaxTotalQty] = useState(Number.MAX_SAFE_INTEGER);
  const { mutate } = useNewExpiryDate();

  const handleOpenConfirmation = () => setOpenConfirmation(true);
  const handleCloseConfirmation = () => setOpenConfirmation(false);
  const handleOpenDatePicker = () => setOpenDatePicker(true);
  const handleCloseDatePicker = (action) => {
    setOpenDatePicker(false);
    if (action === 'updateDate') {
      const filteredDate = item.expiry_dates.filter(
        (date) => date.expiry_date === tempSelectedDate,
      );
      if (filteredDate.length === 0) {
        setSelectedDate(tempSelectedDate);
        setSelectedExpiryId('newDate');
      } else {
        setSelectedDate('');
        setSelectedExpiryId(filteredDate[0].id);
      }
    }
  };
  useEffect(() => {
    const preselectedExpiryId =
      selector == 'All'
        ? item.expiry_dates[0].id
        : item.expiry_dates.find((itemExpiry) => itemExpiry.id == selector).id;

    setSelectedExpiryId(preselectedExpiryId);
  }, [item, hasExpiry, selector]);

  useEffect(() => {
    if (hasExpiry && type == CART_ITEM_TYPE_DEPOSIT) {
      if (selectedDate === '') {
        setItemExpiryDates([
          ...item.expiry_dates,
          { id: 'addNew', expiry_date: 'New' },
        ]);
      } else {
        setItemExpiryDates([
          ...item.expiry_dates,
          { id: 'newDate', expiry_date: selectedDate },
          { id: 'addNew', expiry_date: 'New' },
        ]);
      }
    } else {
      setItemExpiryDates(item.expiry_dates);
    }
  }, [selectedDate, hasExpiry, item.expiry_dates, type]);

  const getExpiryFromId = (expiryId) => {
    if (expiryId === 'newDate') {
      return selectedDate;
    }
    return (
      item.expiry_dates.find((itemExpiry) => itemExpiry.id == expiryId)
        .expiry_date || 'No Expiry'
    );
  };

  const validationSchema = yup.object({
    quantity: yup
      .number('Enter a number for opened quantity')
      .min(0, 'Number cannot be negative')
      .max(maxTotalQty, 'Number cannot be more than that'),
  });

  const addNewExpiry = async () => {
    const data = {
      item: item.id,
      expiry_date: getExpiryFromId(selectedExpiryId),
      quantity: formik.values.quantity,
    };
    mutate(data);
  };

  const formik = useFormik({
    initialValues: {
      quantity: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (values.quantity == '') {
        values.quantity = 0;
      }
      if (values.quantity == 0) {
        handleClose();
        resetForm();
        return;
      }
      if (getCartState(cartItems) !== '' && getCartState(cartItems) !== type) {
        alert("You can't deposit and withdraw at the same time!");
        return;
      }
      const isDeposit = type == CART_ITEM_TYPE_DEPOSIT;
      setCartState(type);
      const cartItem = {
        ...item,
        expiryId: selectedExpiryId,
        type: isDeposit ? CART_ITEM_TYPE_DEPOSIT : CART_ITEM_TYPE_WITHDRAW,
        cartTotalQuantity: formik.values.quantity,
      };

      handleClose();
      if (isDeposit && selectedExpiryId === 'newDate') {
        addNewExpiry();
      } else {
        addToCart(cartItem, cartItems, setCartItems);
        setSnackbarOpen(true);
        handleClose();
      }
      resetForm();
    },
  });

  const setMaxQtys = useCallback(
    (expiryId) => {
      const { maxTotalQty: calculatedMaxTotalQty } = getMaxWithdrawalQty(
        cartItems,
        expiryId,
        item,
      );
      setMaxTotalQty(calculatedMaxTotalQty);
    },
    [cartItems, item],
  );

  const updateTempSelectedDate = (value) => {
    const date = dayjs(value.$d).format('YYYY-MM-DD');
    setTempSelectedDate(date);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDate('');
    setTempSelectedDate('');
  };

  return (
    <>
      <SnackBarAlerts
        severity='success'
        open={snackbarOpen}
        message='Added to cart'
        onClose={() => setSnackbarOpen(false)}
      />

      <ConfirmationDialog
        openConfirmation={openConfirmation}
        handleCloseConfirmation={handleCloseConfirmation}
        handleSubmit={formik.handleSubmit}
      />

      <DatePickerDialog
        openDatePicker={openDatePicker}
        handleCloseDatePicker={handleCloseDatePicker}
        updateTempSelectedDate={updateTempSelectedDate}
      />

      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Stack
            spacing={2}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              boxShadow: 24,
              bgcolor: 'background.paper',
              p: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              '& > :last-child': {
                marginTop: 5,
              },
              boxShadow:
                theme.palette.mode === 'light'
                  ? 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px'
                  : 'rgb(255 255 255 / 25%) 0px 54px 55px, rgb(237 228 228 / 12%) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgb(221 205 205 / 17%) 0px 12px 13px, rgb(220 201 201 / 9%) 0px -3px 5px',
              borderRadius: '6px',
              border: 'none',
              // border:
              //   theme.palette.mode === 'light'
              //     ? '1.5px solid #000000c2'
              //     : '1.5px solid #ffffffcf',
            }}
          >
            {item.imgpic ? (
              <Avatar
                alt={`${item.name}`}
                src={`${item.imgpic}`}
                sx={{ width: 90, height: 90 }}
              />
            ) : (
              <img
                src='/static/inventory/img/logo.png'
                width={90}
                height={90}
              />
            )}
            <Typography id='transition-modal-title' variant='h4' component='h2'>
              {item.name}
            </Typography>
            <TextField
              id='filled-select-expiry-date'
              select={
                getExpiryFromId(selectedExpiryId) !== 'No Expiry' &&
                (type == CART_ITEM_TYPE_DEPOSIT || showDropdown)
              }
              disabled={
                getExpiryFromId(selectedExpiryId) === 'No Expiry' ||
                (type != CART_ITEM_TYPE_DEPOSIT && !showDropdown)
              }
              label='Expiry Date'
              value={getExpiryFromId(selectedExpiryId)}
              variant='filled'
              sx={{ width: '80%' }}
            >
              {itemExpiryDates.map((itemExp) =>
                itemExp.expiry_date !== 'New' ? (
                  <MenuItem
                    key={itemExp.id}
                    value={itemExp.expiry_date}
                    onClick={() => {
                      setSelectedExpiryId(itemExp.id);
                      if (
                        itemExp.id !== 'newDate' &&
                        type == CART_ITEM_TYPE_WITHDRAW
                      ) {
                        setMaxQtys(itemExp.id);
                      } else {
                        setMaxTotalQty(Number.MAX_SAFE_INTEGER);
                      }
                    }}
                  >
                    <Typography variant='h8'>{itemExp.expiry_date}</Typography>
                  </MenuItem>
                ) : (
                  <MenuItem
                    key={itemExp.id}
                    value={itemExp.expiry_date}
                    onClick={() => {
                      handleOpenDatePicker();
                    }}
                  >
                    <Box
                      display={'flex'}
                      alignItems={'center'}
                      justifyContent={'center'}
                      paddingRight={'10px'}
                      width={'100%'}
                    >
                      <AddIcon />
                      <Typography variant='h8'>
                        {itemExp.expiry_date}
                      </Typography>
                    </Box>
                  </MenuItem>
                ),
              )}
            </TextField>
            <TextField
              id='filled-basic'
              type='number'
              label='Quantity'
              variant='filled'
              name='quantity'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>{item.unit}</InputAdornment>
                ),
              }}
              sx={{ width: '80%' }}
              value={formik.values.quantity}
              onChange={formik.handleChange}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={formik.touched.quantity && formik.errors.quantity}
            />
            {type == CART_ITEM_TYPE_DEPOSIT ? (
              <Button
                variant='contained'
                role='submit-button'
                color='success'
                endIcon={<AddCircleIcon />}
                onClick={() => {
                  if (selectedExpiryId === 'newDate') {
                    handleOpenConfirmation();
                  } else {
                    formik.handleSubmit();
                  }
                }}
              >
                Submit
              </Button>
            ) : (
              <Button
                variant='contained'
                role='submit-button'
                color='error'
                endIcon={<RemoveCircleIcon />}
                onClick={formik.handleSubmit}
              >
                Withdraw
              </Button>
            )}
          </Stack>
        </Fade>
      </Modal>
    </>
  );
};

CartPopupModal.propTypes = {
  type: PropTypes.string.isRequired,
  item: ItemPropType.isRequired,
  selector: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired,
  ]),
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
