const API_BASE_URL = '/inventory/api';
export const Api = {
  items: `${API_BASE_URL}/items`,
  user: `${API_BASE_URL}/user`,
  submitOrder: `${API_BASE_URL}/submit_order`,
  addItem: `${API_BASE_URL}/add_item`,
  loans: `${API_BASE_URL}/orders/loan`,
  returnLoan: `${API_BASE_URL}/loan_return_post`,
  submitNewExpiryDate: `${API_BASE_URL}/add_expiry`,
  orders: `${API_BASE_URL}/orders/all`,
  order: `${API_BASE_URL}/orders/get/:id`,
  revertOrder: `${API_BASE_URL}/revert_order`,
  importItems: `${API_BASE_URL}/import_items`,
  exportItems: `${API_BASE_URL}/export_items`,
};
