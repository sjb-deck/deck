import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { LOCAL_STORAGE_KIT_CART_KEY } from '../globals/constants';

export const KitCartContext = React.createContext();

const getKitCartItemsFromLocalStorage = () => {
  const cartItems = localStorage.getItem(LOCAL_STORAGE_KIT_CART_KEY);
  return cartItems ? JSON.parse(cartItems) : [];
};

const appendToLocalStorageKitCart = (currentLocalStorageCart, cartItem) => {
  currentLocalStorageCart.push(cartItem);
  return currentLocalStorageCart;
};

export const KitCartProvider = ({ children, value: testValues }) => {
  const defaultKitCartItems = getKitCartItemsFromLocalStorage() || [];

  const [kitCartItems, setKitCartItems] = useState(
    testValues?.cartItems || defaultKitCartItems,
  );

  const addToCart = (cartItem) => {
    const localStorageKitCartState = appendToLocalStorageKitCart(
      kitCartItems,
      cartItem,
    );
    localStorage.setItem(
      LOCAL_STORAGE_KIT_CART_KEY,
      JSON.stringify(localStorageKitCartState),
    );
    setKitCartItems(localStorageKitCartState);
  };

  const clearCart = () => {
    localStorage.removeItem(LOCAL_STORAGE_KIT_CART_KEY);
    setKitCartItems([]);
  };

  const removeItemFromKitCart = (kitId) => {
    const newKitCartItems = kitCartItems.filter((kit) => kit.id !== kitId);
    if (newKitCartItems.length === 0) {
      clearCart();
      return;
    }

    localStorage.setItem(
      LOCAL_STORAGE_KIT_CART_KEY,
      JSON.stringify(newKitCartItems),
    );
    setKitCartItems(newKitCartItems);
  };

  return (
    <KitCartContext.Provider
      value={{
        kitCartItems,
        addToCart,
        clearCart,
        removeItemFromKitCart,
      }}
    >
      {children}
    </KitCartContext.Provider>
  );
};

KitCartProvider.propTypes = {
  children: PropTypes.node,
  value: PropTypes.shape({
    cartState: PropTypes.string,
    cartItems: PropTypes.array,
  }),
};
