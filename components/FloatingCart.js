/**
 * A React component that renders a floating cart that
 * leads to the cart page and also has a badge that
 * indicates how many items are in the cart
 * @returns FloatingCart
 */

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Button, Badge } from '@mui/material';
import React, { useContext } from 'react';

import { URL_INV_CART } from '../globals';

import { CartContext } from './CartContext';

const FloatingCart = () => {
  const { cartItems } = useContext(CartContext);

  return (
    <Button
      onClick={() => (window.location.href = URL_INV_CART)}
      variant='contained'
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        borderRadius: '100%',
        padding: '6px',
        height: '60px',
        width: '60px',
      }}
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
