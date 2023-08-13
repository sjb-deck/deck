/**
 * Returns the maximum quantity of the item that can be withdrawn.
 * This takes into account the current cart state.
 *
 * @param {number} selectedExpiryId - The expiry id of the item
 * @param {ItemType} item - The item to be added to cart
 * @returns {minTotalQty: number} - The maximum quantity of the item that can be added to cart
 */

const findTargetItemInCart = (cartItems, selectedExpiryId, item) => {
  const targetItem = cartItems.find((cartItem) => {
    if (cartItem.id !== item.id) {
      return false;
    }
    if (selectedExpiryId === 'No Expiry') {
      return true;
    }
    return cartItem.expiryId === selectedExpiryId;
  });
  return targetItem;
};

export const getMaxWithdrawalQty = (cartItems, selectedExpiryId, item) => {
  const maxQty = selectedExpiryId
    ? item.expiry_dates.find((itemExpiry) => itemExpiry.id === selectedExpiryId)
        .quantity
    : item.total_quantity;

  const targetItemInCart = findTargetItemInCart(
    cartItems,
    selectedExpiryId,
    item,
  );

  return {
    maxTotalQty: targetItemInCart
      ? maxQty - targetItemInCart.cartTotalQuantity
      : maxQty,
  };
};
