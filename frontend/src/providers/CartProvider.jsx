import PropTypes from 'prop-types';
import { createContext, useState } from 'react';

import { LOCAL_STORAGE_CART_KEY } from '../globals/constants';

export const CartContext = createContext();

const getCartStateFromLocalStorage = () => {
  const cartItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CART_KEY));
  if (cartItems && cartItems.length > 0) return cartItems[0].type;
  else return '';
};

const getCartItemsFromLocalStorage = () => {
  const cartItems = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
  return cartItems ? JSON.parse(cartItems) : [];
};

const appendToLocalStorageCart = (currentLocalStorageCart, cartItem) => {
  // find and merge duplicate items
  let hasDuplicates = false;
  const newLocalStorageCart = currentLocalStorageCart.map((item) => {
    if (item.id === cartItem.id && item.expiryId === cartItem.expiryId) {
      hasDuplicates = true;
      return {
        ...item,
        cartQuantity: item.cartQuantity + cartItem.cartQuantity,
      };
    }
    return item;
  });
  // if no duplicates, append to cart
  if (!hasDuplicates) {
    newLocalStorageCart.push(cartItem);
  }
  return newLocalStorageCart;
};

export const CartProvider = ({ children, value: testValues }) => {
  const defaultCartState = getCartStateFromLocalStorage();
  const defaultCartItems = getCartItemsFromLocalStorage() || [];

  const [cartState, setCartState] = useState(
    testValues?.cartState || defaultCartState,
  );
  const [cartItems, setCartItems] = useState(
    testValues?.cartItems || defaultCartItems,
  );

  const addToCart = (cartItem) => {
    const localStorageCartState = appendToLocalStorageCart(cartItems, cartItem);
    localStorage.setItem(
      LOCAL_STORAGE_CART_KEY,
      JSON.stringify(localStorageCartState),
    );
    setCartItems(localStorageCartState);
    setCartState(localStorageCartState[0].type);
  };

  const clearCart = () => {
    localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
    setCartItems([]);
    setCartState('');
  };

  const removeItemFromCart = (expiryId) => {
    const newCartItems = cartItems.filter((item) => item.expiryId !== expiryId);
    if (newCartItems.length === 0) {
      localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
      setCartItems([]);
      setCartState('');
      return;
    }

    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(newCartItems));
    setCartItems(newCartItems);
    setCartState(newCartItems[0].type);
  };

  const editCartItemQuantity = (expiryId, newQuantity) => {
    const newCartItems = cartItems.map((item) => {
      if (item.expiryId === expiryId) {
        return {
          ...item,
          cartQuantity: newQuantity,
        };
      }
      return item;
    });
    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(newCartItems));
    setCartItems(newCartItems);
  };

  return (
    <CartContext.Provider
      value={{
        cartState,
        cartItems,
        addToCart,
        clearCart,
        removeItemFromCart,
        editCartItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node,
  value: PropTypes.shape({
    cartState: PropTypes.string,
    cartItems: PropTypes.array,
  }),
};
