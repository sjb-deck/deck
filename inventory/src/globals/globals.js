// Globals
export const URL_INV_INDEX = '/inventory';
export const URL_LOGOUT = '/logout';
export const URL_PROFILE = '/accounts/edit';
export const URL_INV_CART = '/inventory/items/cart';
export const URL_INV_ALERTS = '/inventory/alerts';
export const URL_INV_ITEMS = '/inventory/items/';
export const URL_INV_ADD_ITEM = '/inventory/items/add_item';
export const URL_INV_VIEW_ITEM = '/inventory/items/view_item';
export const URL_INV_VIEW_ORDERS_LOANS = '/inventory/admin';
export const URL_INV_VIEW_ORDERS = '/inventory/items/view_orders';
export const URL_INV_VIEW_LOANS = '/inventory/view_loans';
export const URL_INV_LOAN_RETURN = '/inventory/loan_return';
export const URL_INV_VIEW_ITEM_LIST = '/inventory/items/item_list';
export const URL_ORDER_RECEIPT = '/inventory/items/receipt';
export const ITEMS_PER_PAGE = 5;
export const ORDERS_PER_PAGE = 10;
export const LOCAL_STORAGE_COLORMODE_KEY = 'Color_Mode';

// Cart
export const CART_ITEM_TYPE_DEPOSIT = 'Deposit';
export const CART_ITEM_TYPE_WITHDRAW = 'Withdraw';
export const LOCAL_STORAGE_CART_KEY = 'FA_cart';

// API Endpoints
export const INV_API_BASE_URL = '/inventory/api';
export const INV_API_ITEMS_URL = `${INV_API_BASE_URL}/items`;
export const INV_API_USER_URL = `${INV_API_BASE_URL}/user`;
export const INV_API_SUBMIT_ORDER_URL = `${INV_API_BASE_URL}/submit_order`;
export const INV_API_EXPIRY_POST_URL = `${INV_API_BASE_URL}/add_expiry_post`;
export const INV_API_CREATE_NEW_EXPIRY_URL = `${INV_API_BASE_URL}/add_expiry`;
export const INV_API_ORDERS_URL = `${INV_API_BASE_URL}/orders/all`;
export const INV_API_ORDER_URL = `${INV_API_BASE_URL}/orders/get/:id`;
export const INV_API_REVERT_ORDER = `${INV_API_BASE_URL}/revert_order`;
export const INV_API_LOANS_URL = `${INV_API_BASE_URL}/loans`;
export const INV_API_LOAN_RETURN_URL = `${INV_API_BASE_URL}/loan_return_post`;
export const INV_API_IMPORT_ITEMS_URL = `${INV_API_BASE_URL}/import_items`;
export const INV_API_EXPORT_ITEMS_URL = `${INV_API_BASE_URL}/export_items`;
export const INV_API_KITS_URL = `${INV_API_BASE_URL}/kits`;
export const INV_API_ADD_BLUEPRINT_URL = `${INV_API_BASE_URL}/add_blueprint`;

export const ORDER_REASONS = {
  item_restock: 'Restock',
  unserviceable: 'Unserviceable',
  others: 'Others',
  loan: 'Loan',
  kit_restock: 'Kit Restock',
  kit_create: 'Kit Create',
  kit_retire: 'Kit Retire',
};
