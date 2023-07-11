import { LOCAL_STORAGE_CART_KEY } from '../../globals';

/**
 * Gets the cart state from local storage and returns it
 * @returns 'Withdraw' or 'Deposit' or ''
 */

export const getCartState = () => {
  const cartData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CART_KEY));
  if (!cartData) return '';
  return cartData[0].type;
};
