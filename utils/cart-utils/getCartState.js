/**
 * From the given cart items, return the cart state, whether it is deposit
 * or withdraw or '' when empty
 * @param cartItems
 * @returns The cart state from the cart items
 */

export const getCartState = (cartItems) => {
  if (cartItems && cartItems.length > 0) return cartItems[0].type;
  else return '';
};
