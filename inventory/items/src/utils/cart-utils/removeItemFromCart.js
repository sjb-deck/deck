import { LOCAL_STORAGE_CART_KEY } from '../../../../src/globals';

export const removeItemFromCart = (cartItems, expiryId, setCartState) => {
  const newCartItems = cartItems.filter((item) => item.expiryId !== expiryId);

  if (newCartItems.length === 0) {
    localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
    setCartState();
    return;
  }

  localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(newCartItems));

  setCartState(newCartItems);
};
