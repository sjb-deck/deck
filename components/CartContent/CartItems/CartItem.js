import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  Avatar,
  Button,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import React, { useContext } from 'react';

import { CartItemPropType } from '../../../globals';
import { CartContext } from '../../../providers/CartProvider';
import { removeItemFromCart } from '../../../utils/cart-utils/removeItemFromCart';
import { Paper } from '../../styled';

export const CartItem = ({ cartItem }) => {
  const expiryDate =
    cartItem.expirydates.find((expiry) => expiry.id === cartItem.expiryId)
      .expirydate || 'No Expiry';

  const { cartItems, setCartItems } = useContext(CartContext);

  const handleDeleteCartItem = () => {
    removeItemFromCart(cartItems, cartItem.expiryId, setCartItems);
  };

  return (
    <Paper style={{ width: '100%' }}>
      <Stack
        direction='row'
        spacing={2}
        justifyContent='center'
        alignItems='center'
      >
        <Stack
          direction='column'
          justifyContent='center'
          alignItems='center'
          spacing={1}
        >
          {cartItem.imgpic ? (
            <Avatar
              alt={`${cartItem.name}`}
              src={`${cartItem.imgpic}`}
              sx={{ width: 90, height: 90 }}
            />
          ) : (
            <img src='/static/inventory/img/logo.png' width={90} height={90} />
          )}

          <Chip label={expiryDate} color='primary' size='small' />
        </Stack>

        <Divider orientation='vertical' />

        <Stack justifyContent='center' flexGrow={1} spacing={1}>
          <Typography variant='h5' fontWeight='bold'>
            {cartItem.name}
          </Typography>
          <Typography variant='caption'>
            Opened Qty: {cartItem.cartOpenedQuantity}
          </Typography>
          <Typography variant='caption'>
            Unopened Qty: {cartItem.cartUnopenedQuantity}
          </Typography>
          <Button
            variant='outlined'
            size='small'
            startIcon={<EditIcon fontSize='inherit' />}
            style={{ width: '100px' }}
          >
            Edit
          </Button>
        </Stack>

        <IconButton
          aria-label='delete'
          size='medium'
          onClick={handleDeleteCartItem}
        >
          <HighlightOffIcon fontSize='inherit' />
        </IconButton>
      </Stack>
    </Paper>
  );
};

CartItem.propTypes = {
  cartItem: CartItemPropType.isRequired,
};
