/**
 * A React component that renders a floating cart that
 * leads to the cart page and also has a badge that
 * indicates how many items are in the cart
 * @returns FloatingCart
 */

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Button, Badge } from '@mui/material';
import React from 'react';

import { URL_INV_CART } from '../globals';
import { getCartItems } from '../utils/cart-utils/getCartItems';

const FloatingCart = () => {
  const cartItems = getCartItems();

  return (
    <Button
      onClick={() => (window.location.href = URL_INV_CART)}
      variant='contained'
      style={{ position: 'fixed', right: 20, bottom: 20, borderRadius: 28 }}
    >
      <Badge
        color='secondary'
        badgeContent={cartItems.length == 0 ? 0 : cartItems.length}
        showZero
      >
        <ShoppingCartIcon style={{ fontSize: 40 }} />
      </Badge>
    </Button>
  );
};

export default FloatingCart;
