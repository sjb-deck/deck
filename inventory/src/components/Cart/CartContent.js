import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem, Stack, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import React, { useContext, useMemo } from 'react';

import { CART_ITEM_TYPE_WITHDRAW, URL_ORDER_RECEIPT } from '../../globals';
import { useOrders } from '../../hooks/mutations';
import { CartContext } from '../../providers';
import { getDjangoFriendlyDate } from '../../utils';
import { LoadingSpinner } from '../LoadingSpinner';
import { Paper } from '../styled';

import { CartItems } from './CartItems/CartItems';
import { emptyCartMessage } from './labels';
import { validationSchema } from './schema';
import '../../globals/styles/inventoryBase.scss';

export const CartContent = () => {
  const { cartItems, clearCart, cartState } = useContext(CartContext);
  const isWithdraw = cartState === 'Withdraw';
  const isEmpty = cartState === '';
  const setSelectedOption = (value) => {
    formik.setFieldValue('selectedOption', value);
  };

  const { mutate, isLoading } = useOrders();

  const formik = useFormik({
    initialValues: {
      loaneeName: '',
      returnDate: dayjs(),
      reason: '',
      selectedOption: isWithdraw ? 'loan' : 'item_restock',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const data = buildPayload(values);
      mutate(data, {
        onSuccess: (res) => {
          const orderId = encodeURIComponent(JSON.stringify(res.id));
          window.location.href = `${URL_ORDER_RECEIPT}?orderId=${orderId}`;
          clearCart();
        },
      });
    },
  });

  const buildPayload = (values) => {
    const options = isWithdraw ? withdrawOptions : depositOptions;
    const selectedValues =
      options.find((option) => option.value === values.selectedOption)
        ?.fieldValues || {};
    return {
      ...selectedValues,
      action: cartState,
      reason: values.selectedOption,
      order_items: cartItems.map((item) => ({
        item_expiry_id: item.expiryId,
        ordered_quantity: item.cartQuantity,
      })),
    };
  };

  const withdrawOptions = useMemo(
    () => [
      {
        label: 'Loan',
        value: 'loan',
        fields: [
          <TextField
            key='loaneeName'
            label='Loanee Name'
            name='loaneeName'
            fullWidth
            value={formik.values.loaneeName}
            onChange={formik.handleChange}
            error={formik.touched.loaneeName && !!formik.errors.loaneeName}
            helperText={formik.touched.loaneeName && formik.errors.loaneeName}
          />,
          <DatePicker
            key='returnDate'
            label='Return Date'
            name='returnDate'
            defaultValue={dayjs()}
            format='LL'
            disablePast
            sx={{ width: '100%' }}
            value={formik.values.returnDate}
            onChange={(date) => formik.setFieldValue('returnDate', date)}
            error={formik.touched.returnDate && !!formik.errors.returnDate}
            helperText={formik.touched.returnDate && formik.errors.returnDate}
          />,
        ],
        fieldValues: {
          loanee_name: formik.values.loaneeName,
          due_date: getDjangoFriendlyDate(formik.values.returnDate),
        },
      },
      {
        label: 'Unserviceable',
        value: 'unserviceable',
        fields: [],
        fieldValues: {},
      },
      {
        label: 'Others',
        value: 'others',
        fields: [
          <TextField
            key='others'
            label='Reason'
            name='reason'
            fullWidth
            multiline
            value={formik.values.reason}
            onChange={formik.handleChange}
            error={formik.touched.reason && !!formik.errors.reason}
            helperText={formik.touched.reason && formik.errors.reason}
          />,
        ],
        fieldValues: { other_info: formik.values.reason },
      },
    ],
    [formik],
  );

  const depositOptions = useMemo(
    () => [
      { label: 'Restocking of Stocks', value: 'item_restock', fields: [] },
      {
        label: 'Others',
        value: 'others',
        fields: [
          <TextField
            key='others'
            label='Reason'
            name='reason'
            fullWidth
            multiline
            value={formik.values.reason}
            onChange={formik.handleChange}
            error={formik.touched.reason && !!formik.errors.reason}
            helperText={formik.touched.reason && formik.errors.reason}
          />,
        ],
        fieldValues: { other_info: formik.values.reason },
      },
    ],
    [formik],
  );

  if (isEmpty) {
    return (
      <Stack justifyContent='center' alignItems='center' minHeight={'100vh'}>
        <div className='nav-margin-compensate'>
          <Typography variant='h1'>{emptyCartMessage}</Typography>
        </div>
      </Stack>
    );
  }

  return (
    <Stack
      className='nav-margin-compensate'
      spacing={3}
      padding={1}
      sx={{
        alignItems: 'center',
        justifyContent: 'start',
        width: '100%',
        marginBottom: '50px',
        minHeight: '100vh',
      }}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Paper
            className='dynamic-width'
            style={{ padding: 20 }}
            elevation={3}
          >
            <Stack justifyContent='center' alignItems='center' spacing={2}>
              <Typography variant='h4' alignSelf='start'>
                {cartState} Cart
              </Typography>
              <TextField
                select
                label={`${cartState} Options`}
                fullWidth
                value={formik.values.selectedOption}
                onChange={(event) => setSelectedOption(event.target.value)}
              >
                {isWithdraw
                  ? withdrawOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))
                  : depositOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
              </TextField>
              {formik.values.selectedOption &&
                (isWithdraw
                  ? withdrawOptions.find(
                      (option) => option.value === formik.values.selectedOption,
                    ).fields
                  : depositOptions.find(
                      (option) => option.value === formik.values.selectedOption,
                    ).fields)}
            </Stack>
          </Paper>
          <CartItems />
          <LoadingButton
            className='dynamic-width'
            variant='contained'
            onClick={formik.handleSubmit}
            endIcon={<SendIcon />}
            color={cartState === CART_ITEM_TYPE_WITHDRAW ? 'error' : 'success'}
            sx={{ marginBottom: '20px' }}
          >
            Submit
          </LoadingButton>
        </>
      )}
    </Stack>
  );
};
