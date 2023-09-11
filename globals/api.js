const INV_API_BASE_URL = '/inventory/api';

export const Api = {
  items: `${INV_API_BASE_URL}/items`,
  user: `${INV_API_BASE_URL}/user`,
  submitOrder: `${INV_API_BASE_URL}/submit_order`,
  submitNewExpiryDate: `${INV_API_BASE_URL}/add_expiry`,
  orders: `${INV_API_BASE_URL}/orders/all`,
  revertOrder: `${INV_API_BASE_URL}/revert_order`,
};
