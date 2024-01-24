/**
 * A React component that renders a floating cart that
 * leads to the cart page and also has a badge that
 * indicates how many items are in the cart
 * @returns FloatingCart
 */

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge, Fab } from '@mui/material';
import React, { useContext } from 'react';

import { URL_INV_CART } from '../../../globals';
import { CartContext } from '../../../providers';

export const FloatingCart = () => {
  const { cartItems } = useContext(CartContext);

  return (
    <Fab
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
        zIndex: 1000,
        background:
          'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(0,232,255,1) 0%, rgba(72,116,197,1) 100%, rgba(30,155,173,1) 100%, rgba(93,97,209,1) 100%, rgba(2,3,6,1) 100%)',
        color: 'black',
        boxShadow: '0px 0px 10px rgba(255, 183, 0, 0.8)',
      }}
    >
      <Badge
        color='secondary'
        badgeContent={cartItems.length == 0 ? 0 : cartItems.length}
        showZero
        invisible={cartItems.length === 0}
      >
        <ShoppingCartIcon style={{ fontSize: 40 }} />
      </Badge>
    </Fab>
  );
};
