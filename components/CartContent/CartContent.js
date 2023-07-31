import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem, Stack, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React, { useContext, useMemo, useState } from 'react';

import { CART_ITEM_TYPE_WITHDRAW } from '../../globals';
import { useOrders } from '../../hooks/mutations';
import { CartContext } from '../../providers';
import { clearCart, getCartState, getDjangoFriendlyDate } from '../../utils';
import { LoadingSpinner } from '../LoadingSpinner';
import { Paper } from '../styled';

import { CartItems } from './CartItems/CartItems';
import { emptyCartMessage } from './labels';

export const CartContent = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const cartState = getCartState(cartItems);
  const isWithdraw = cartState === 'Withdraw';
  const isEmpty = cartState === '';
  const [selectedOption, setSelectedOption] = useState(
    isWithdraw ? 'loan' : 'item_restock',
  );

  const [loaneeName, setLoaneeName] = useState('');
  const [returnDate, setReturnDate] = useState(dayjs());
  const [reason, setReason] = useState('');
  const { mutate, isLoading } = useOrders();

  const handleSubmit = async () => {
    const data = buildPayload();
    mutate(data, {
      onSuccess: () => {
        // TODO: Instead of redirecting, show order items
        clearCart(setCartItems);
        window.location.href = URL_INV_ITEMS;
      },
    });
  };

  const buildPayload = () => {
    const options = isWithdraw ? withdrawOptions : depositOptions;
    const selectedValues =
      options.find((option) => option.value === selectedOption)?.fieldValues ||
      {};
    return {
      ...selectedValues,
      action: cartState,
      reason: selectedOption,
      order_items: cartItems.map((item) => ({
        item_expiry: item.expiryId,
        opened_quantity: item.cartOpenedQuantity,
        unopened_quantity: item.cartUnopenedQuantity,
      })),
    };
  };

  const withdrawOptions = useMemo(
    () => [
      // TODO: Uncomment when phase 2 is ready
      // {
      //   label: 'Restocking of Pouches (Internal)',
      //   value: 'kit_restock',
      //   fields: [
      //     <Tooltip key='select_kit' title='Available in Phase 2'>
      //       <TextField
      //         select
      //         label='Select Kit'
      //         fullWidth
      //         disabled
      //         value={kitToRestock}
      //         onChange={(event) => setKitToRestock(event.target.value)}
      //       />
      //     </Tooltip>,
      //   ],
      //   fieldValues: { kit: kitToRestock },
      // },
      {
        label: 'Loan',
        value: 'loan',
        fields: [
          <TextField
            key='loanee_name'
            label='Loanee Name'
            fullWidth
            value={loaneeName}
            onChange={(event) => setLoaneeName(event.target.value)}
          />,
          <DatePicker
            key='return_date'
            label='Return Date'
            defaultValue={dayjs()}
            format='LL'
            disablePast
            sx={{ width: '100%' }}
            value={returnDate}
            onChange={(date) => setReturnDate(date)}
          />,
        ],
        fieldValues: {
          loanee_name: loaneeName,
          return_date: getDjangoFriendlyDate(returnDate),
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
            fullWidth
            multiline
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />,
        ],
        fieldValues: { other_info: reason },
      },
    ],
    [loaneeName, reason, returnDate],
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
            fullWidth
            multiline
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />,
        ],
        fieldValues: { other_info: reason },
      },
    ],
    [reason],
  );

  if (isEmpty) {
    return (
      <Stack justifyContent='center' alignItems='center'>
        <Typography className='nav-margin-compensate' variant='h1'>
          {emptyCartMessage}
        </Typography>
      </Stack>
    );
  }

  return !isLoading ? (
    <>
      <Stack
        alignItems='center'
        justifyContent='center'
        spacing={3}
        width='100%'
        position='absolute'
        top='80px'
      >
        <Paper className='dynamic-width' style={{ padding: 20 }}>
          <Stack justifyContent='center' alignItems='center' spacing={2}>
            <Typography variant='h4' alignSelf='start'>
              {cartState} Cart
            </Typography>
            <TextField
              select
              label={`${cartState} Options`}
              fullWidth
              value={selectedOption}
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
            {selectedOption &&
              (isWithdraw
                ? withdrawOptions.find(
                    (option) => option.value === selectedOption,
                  ).fields
                : depositOptions.find(
                    (option) => option.value === selectedOption,
                  ).fields)}
          </Stack>
        </Paper>
        <CartItems />
        <LoadingButton
          className='dynamic-width'
          variant='contained'
          size='large'
          endIcon={<SendIcon />}
          color={cartState === CART_ITEM_TYPE_WITHDRAW ? 'error' : 'success'}
          onClick={handleSubmit}
          sx={{ marginBottom: '20px' }}
        >
          Submit
        </LoadingButton>
      </Stack>
    </>
  ) : (
    <LoadingSpinner />
  );
};
