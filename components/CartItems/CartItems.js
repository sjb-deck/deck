import { Stack } from '@mui/material';
import React from 'react';

import { getCartItems } from '../../utils/cart-utils/getCartItems';
import { Box } from '../styled';

import { CartItem } from './CartItem';

export const CartItems = () => {
  const cartItems = getCartItems();

  return (
    <Box overflow='scroll' maxHeight='50vh'>
      <Stack
        justifyContent='center'
        alignItems='center'
        height={'50%'}
        spacing={2}
      >
        {cartItems.map((item) => (
          <CartItem key={item.expiryId} cartItem={item} />
        ))}
      </Stack>
    </Box>
  );
};
