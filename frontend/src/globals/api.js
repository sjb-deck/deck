const API_BASE_URL = '/api/v1';
const ACC_API_BASE_URL = `${API_BASE_URL}/accounts`;
const INV_API_BASE_URL = `${API_BASE_URL}/inventory`;
const INV_ITEMS_API_BASE_URL = `${INV_API_BASE_URL}/items`;
const INV_KITS_API_BASE_URL = `${INV_API_BASE_URL}/kits`;

export const Api = {
  login: `${ACC_API_BASE_URL}/token/`,
  refresh: `${ACC_API_BASE_URL}/token/refresh/`,
  items: INV_ITEMS_API_BASE_URL,
  edit: `${ACC_API_BASE_URL}/edit`,

  submitOrder: `${INV_ITEMS_API_BASE_URL}/submit_order`,
  addItem: `${INV_ITEMS_API_BASE_URL}/add_item`,
  submitNewExpiryDate: `${INV_ITEMS_API_BASE_URL}/add_expiry`,
  returnLoan: `${INV_ITEMS_API_BASE_URL}/loan_return_post`,
  importItems: `${INV_ITEMS_API_BASE_URL}/import_items`,
  exportItems: `${INV_ITEMS_API_BASE_URL}/export_items`,
  order: `${INV_ITEMS_API_BASE_URL}/orders?orderId=:id`,
  orders: `${INV_ITEMS_API_BASE_URL}/orders?option=order&page=:page&item=:item&username=:username&reason=:reason`,
  loans: `${INV_ITEMS_API_BASE_URL}/orders?option=loan&page=:page&loaneeName=:loaneeName&item=:item&username=:username`, // TODO: Combine with the loan_active endpoint
  loan_active: `${INV_ITEMS_API_BASE_URL}/orders?option=loan_active&page=:page`,
  revertOrder: `${INV_ITEMS_API_BASE_URL}/revert_order`,

  kits: INV_KITS_API_BASE_URL,
  kitHistory: `${INV_KITS_API_BASE_URL}/kit_history?kitId=:kitId&page=:page&kitName=:kitName&type=:type&loaneeName=:loaneeName&user=:user`,
  returnKit: `${INV_KITS_API_BASE_URL}/return_kit_order`,
  kit: `${INV_KITS_API_BASE_URL}?kitId=:kitId`,
  revertHistory: `${INV_KITS_API_BASE_URL}/revert_kit/:id`,
  kitRecipe: `${INV_KITS_API_BASE_URL}/get_new_kit_recipe/:id`,
  createKit: `${INV_KITS_API_BASE_URL}/add_kit`,
  addBlueprint: `${INV_KITS_API_BASE_URL}/add_blueprint`,
  kitRestockOptions: `${INV_KITS_API_BASE_URL}/restock_options/:id`,
  kitRestock: `${INV_KITS_API_BASE_URL}/restock_kit`,
  submitKitOrder: `${INV_KITS_API_BASE_URL}/submit_kit_order`,
};

export const invalidateQueryKeys = ({ id } = {}) => ({
  addItem: ['items'],
  submitOrder: ['items', 'orders', 'kitRestockOptions'],
  submitNewExpiryDate: ['items', 'kitRestockOptions'],
  returnLoan: ['items', 'loans', 'loan_active', 'kitRestockOptions'],
  importItems: ['items', 'kitRestockOptions'],
  exportItems: [],
  revertOrder: ['items', 'orders', ['order', id], 'kitRestockOptions'],
  addBlueprint: [],
  createKit: ['kits', 'items', 'orders', 'kitRestockOptions'],
  returnKit: ['kits', ['kit', { kitId: id }], 'kitHistory'],
  revertHistory: ['kits', 'kit', 'kitHistory'],
  kitRestock: ['kits', ['kit', { kitId: id }], 'kitHistory'],
  submitKitOrder: ['kits', 'kit', 'kitHistory'],
  login: [],
});
