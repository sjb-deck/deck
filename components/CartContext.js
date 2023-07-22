import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { LOCAL_STORAGE_CART_KEY } from '../globals';

export const CartContext = React.createContext();

const getCartStateFromLocalStorage = () => {
  const cartItems = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
  if (cartItems && cartItems.length > 0) return cartItems[0].type;
  else return '';
};

const getCartItemsFromLocalStorage = () => {
  const cartItems = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
  return cartItems ? JSON.parse(cartItems) : [];
};

export const CartProvider = ({ children }) => {
  const [cartState, setCartState] = useState(getCartStateFromLocalStorage());
  const [cartItems, setCartItems] = useState(
    getCartItemsFromLocalStorage() || [],
  );
  return (
    <CartContext.Provider
      value={{ cartState, setCartState, cartItems, setCartItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node,
};
