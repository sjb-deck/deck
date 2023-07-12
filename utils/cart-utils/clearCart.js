import { LOCAL_STORAGE_CART_KEY } from '../../globals';

export const clearCart = () => {
  localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
};
