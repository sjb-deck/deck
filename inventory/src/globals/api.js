const INV_API_BASE_URL = '/inventory/api';

export const Api = {
  items: `${INV_API_BASE_URL}/items`,
  user: `${INV_API_BASE_URL}/user`,
  submitOrder: `${INV_API_BASE_URL}/submit_order`,
  addItem: `${INV_API_BASE_URL}/add_item`,
  loans: `${INV_API_BASE_URL}/orders/loan`,
  returnLoan: `${INV_API_BASE_URL}/loan_return_post`,
  submitNewExpiryDate: `${INV_API_BASE_URL}/add_expiry`,
  orders: `${INV_API_BASE_URL}/orders/all`,
  order: `${INV_API_BASE_URL}/orders/get/:id`,
  revertOrder: `${INV_API_BASE_URL}/revert_order`,
  importItems: `${INV_API_BASE_URL}/import_items`,
  exportItems: `${INV_API_BASE_URL}/export_items`,
  kits: `${INV_API_BASE_URL}/kits`,
};
