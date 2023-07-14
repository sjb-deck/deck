import SendIcon from '@mui/icons-material/Send';
import { LoadingButton } from '@mui/lab';
import { Stack, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { useState } from 'react';

import { CartItems } from '../../components/CartItems/CartItems';
import { CartOptionsSelection } from '../../components/CartOptionsSelection/CartOptionsSelection';
import NavBar from '../../components/NavBar/NavBar';
import { SnackBarAlerts } from '../../components/SnackBarAlerts';
import Theme from '../../components/Themes';
import {
  CART_ITEM_TYPE_WITHDRAW,
  INV_API_SUBMIT_ORDER_URL,
  INV_API_USER_URL,
  URL_INV_ITEMS,
} from '../../globals';
import useFetch from '../../hooks/use-fetch';
import usePostData from '../../hooks/use-post-data';
import { clearCart } from '../../utils/cart-utils/clearCart';
import { getCartItems } from '../../utils/cart-utils/getCartItems';
import { getCartState } from '../../utils/cart-utils/getCartState';
import { getDjangoFriendlyDate } from '../../utils/getDjangoFriendlyDate';
import '../../inventory/src/scss/inventoryBase.scss';

const CartIndex = () => {
  const { data: user, loading: userLoading } = useFetch(INV_API_USER_URL);
  const cartState = getCartState();
  const isEmpty = cartState === '';
  const [optionState, setOptionState] = useState({ option: '', fields: [] });
  const { postData } = usePostData(INV_API_SUBMIT_ORDER_URL);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [postDataLoading, setPostDataLoading] = useState(false);
  const [postDataError, setPostDataError] = useState(null);

  const handleOptionChange = (option) => {
    setOptionState(option);
  };

  const handleSubmit = async () => {
    setPostDataLoading(true);
    const cartItems = getCartItems();
    const data = {
      action: cartState,
      reason: optionState.option,
      other_info: optionState.reason,
      loanee_name: optionState.loanee,
      return_date: getDjangoFriendlyDate(optionState.returnDate),
      user: user.user,
      order_items: cartItems.map((item) => ({
        item_expiry: item.expiryId,
        opened_quantity: item.cartOpenedQuantity,
        unopened_quantity: item.cartUnopenedQuantity,
      })),
    };
    const result = await postData(data);

    if (result.status === 'success') {
      window.location.href = URL_INV_ITEMS;
      clearCart();
      setPostDataLoading(false);
      return;
    }
    setPostDataError(result.error);
    setSnackbarOpen(true);
    setPostDataLoading(false);
  };

  if (isEmpty) {
    return (
      <Theme>
        <NavBar user={user} />
        <Stack justifyContent='center' alignItems='center'>
          <Typography className='nav-margin-compensate' variant='h1'>
            Cart is empty
          </Typography>
        </Stack>
      </Theme>
    );
  }

  return !userLoading ? (
    <Theme>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SnackBarAlerts
          severity={postDataError ? 'error' : 'success'}
          open={snackbarOpen}
          message={
            postDataError ? postDataError : 'Order submitted successfully!'
          }
          onClose={() => setSnackbarOpen(false)}
        />
        <NavBar user={user} />
        <Stack
          alignItems='center'
          justifyContent='center'
          spacing={3}
          width='100%'
          position='absolute'
          top='80px'
        >
          <CartOptionsSelection onOptionChange={handleOptionChange} />
          <CartItems />
          <LoadingButton
            className='dynamic-width'
            variant='contained'
            size='large'
            endIcon={<SendIcon />}
            color={cartState === CART_ITEM_TYPE_WITHDRAW ? 'error' : 'success'}
            onClick={handleSubmit}
            loading={postDataLoading}
            sx={{ marginBottom: '20px' }}
          >
            Submit
          </LoadingButton>
        </Stack>
      </LocalizationProvider>
    </Theme>
  ) : null;
};

export default CartIndex;
