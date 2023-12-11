const INV_API_BASE_URL = '/inventory/api';

export const Api = {
  items: `${INV_API_BASE_URL}/items`,
  user: `${INV_API_BASE_URL}/user`,
  submitOrder: `${INV_API_BASE_URL}/submit_order`,
  addItem: `${INV_API_BASE_URL}/add_item`,
  returnLoan: `${INV_API_BASE_URL}/loan_return_post`,
  submitNewExpiryDate: `${INV_API_BASE_URL}/add_expiry`,
  orders: `${INV_API_BASE_URL}/orders?option=order&page=:page&item=:item&username=:username&reason=:reason`,
  loans: `${INV_API_BASE_URL}/orders?option=loan&page=:page&loaneeName=:loaneeName&item=:item&username=:username`,
  loan_active: `${INV_API_BASE_URL}/orders?option=loan_active&page=:page`,
  order: `${INV_API_BASE_URL}/orders?orderId=:id`,
  revertOrder: `${INV_API_BASE_URL}/revert_order`,
  importItems: `${INV_API_BASE_URL}/import_items`,
  exportItems: `${INV_API_BASE_URL}/export_items`,
  kit: `${INV_API_BASE_URL}/kits?kitId=:kitId`,
  kitHistory: `${INV_API_BASE_URL}/kit_history?kitId=:kitId&page=:page&kitName=:kitName&type=:type&loaneeName=:loaneeName&user=:user`,
  revertHistory: `${INV_API_BASE_URL}/revert_kit/:id`,
  kitRecipe: `${INV_API_BASE_URL}/get_new_kit_recipe/:id`,
  kits: `${INV_API_BASE_URL}/kits`,
};
