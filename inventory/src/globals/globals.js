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
export const URL_INV_VIEW_KITS = '/inventory/kits';
export const URL_INV_KITS_CART = '/inventory/kits/cart';
export const URL_INV_KITS_ADD_BLUEPRINT = '/inventory/kits/create_blueprint';
export const URL_INV_KITS_ADD_KIT = '/inventory/kits/create_kit';
export const ITEMS_PER_PAGE = 5;
export const ORDERS_PER_PAGE = 10;

// Cart
export const CART_ITEM_TYPE_DEPOSIT = 'Deposit';
export const CART_ITEM_TYPE_WITHDRAW = 'Withdraw';
export const LOCAL_STORAGE_CART_KEY = 'FA_cart';
export const LOCAL_STORAGE_KIT_CART_KEY = 'kit_cart';
export const LOCAL_STORAGE_COLORMODE_KEY = 'Color_Mode';

export const ORDER_REASONS = {
  item_restock: 'Restock',
  unserviceable: 'Unserviceable',
  others: 'Others',
  loan: 'Loan',
  kit_restock: 'Kit Restock',
  kit_create: 'Kit Create',
  kit_retire: 'Kit Retire',
};
