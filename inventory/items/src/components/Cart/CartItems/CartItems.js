import { Stack } from '@mui/material';
import React, { useContext } from 'react';

import { CartContext } from '../../../../../src/providers';
import { Box } from '../../styled';

import { CartItem } from './CartItem';

export const CartItems = () => {
  const { cartItems } = useContext(CartContext);

  return (
    <Box overflow='auto' maxHeight='50vh'>
      <Stack
        justifyContent='center'
        alignItems='center'
        height={'50%'}
        spacing={2}
        padding={1}
      >
        {cartItems.map((item) => (
          <CartItem key={item.expiryId} cartItem={item} />
        ))}
      </Stack>
    </Box>
  );
};
