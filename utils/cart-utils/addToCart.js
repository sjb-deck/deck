import { LOCAL_STORAGE_CART_KEY } from '../../globals';

import { getCartItems } from './getCartItems';

/**
 * Adds the cart item to local storage
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
        cartOpenedQuantity:
          item.cartOpenedQuantity + cartItem.cartOpenedQuantity,
        cartUnopenedQuantity:
          item.cartUnopenedQuantity + cartItem.cartUnopenedQuantity,
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

export const addToCart = (cartItem) => {
  const localStorageCartState = appendToLocalStorageCart(
    getCartItems(),
    cartItem,
  );
  localStorage.setItem(
    LOCAL_STORAGE_CART_KEY,
    JSON.stringify(localStorageCartState),
  );
};
