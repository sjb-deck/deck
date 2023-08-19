import { LOCAL_STORAGE_CART_KEY } from '../../globals/globals';

/**
 * Adds the cart item to local storage and updates the cart state in context
 * @returns void
 */

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

export const addToCart = (cartItem, cartItems, setCartState) => {
  const localStorageCartState = appendToLocalStorageCart(cartItems, cartItem);
  localStorage.setItem(
    LOCAL_STORAGE_CART_KEY,
    JSON.stringify(localStorageCartState),
  );
  setCartState(localStorageCartState);
};
