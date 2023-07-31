import { LOCAL_STORAGE_CART_KEY } from '../../globals';

export const clearCart = (setCartState) => {
  localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
  setCartState();
};
