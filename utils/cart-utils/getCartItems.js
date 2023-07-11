import { LOCAL_STORAGE_CART_KEY } from '../../globals';

/**
 * Gets the currently stored items in the cart
 * @returns cart items
 */

export const getCartItems = () => {
  const currentLocalStorageCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
  return currentLocalStorageCart ? JSON.parse(currentLocalStorageCart) : [];
};
