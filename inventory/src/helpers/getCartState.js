import { LOCAL_STORAGE_CART_KEY } from '../../../globals';

export const getCartState = () => {
  const cartData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CART_KEY));
  if (!cartData) return '';
  return cartData[0].type;
};
