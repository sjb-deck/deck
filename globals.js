import { PropTypes } from 'prop-types';

// Globals
export const URL_INV_INDEX = '/inventory';
export const URL_LOGOUT = '/logout';
export const URL_PROFILE = '/accounts/edit';
export const URL_INV_CART = '/inventory/cart';
export const URL_INV_ALERTS = '/inventory/alerts';
export const URL_INV_ITEMS = '/inventory/items';
export const URL_INV_ADD_ITEM = '/inventory/add_item';
export const URL_INV_VIEW_ITEM = '/inventory/view_item';
export const URL_INV_VIEW_ORDERS = '/inventory/view_orders';
export const URL_INV_VIEW_LOANS = '/inventory/view_loans';
export const URL_INV_LOAN_RETURN = '/inventory/loan_return';
export const ITEMS_PER_PAGE = 5;

// Cart
export const CART_ITEM_TYPE_DEPOSIT = 'Deposit';
export const CART_ITEM_TYPE_WITHDRAW = 'Withdraw';
export const LOCAL_STORAGE_CART_KEY = 'FA_cart';

// PropTypes
export const ItemPropType = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  type: PropTypes.string,
  unit: PropTypes.string,
  imgpic: PropTypes.string,
  total_quantityopen: PropTypes.number,
  total_quantityunopened: PropTypes.number,
  min_quantityopen: PropTypes.number,
  min_quantityunopened: PropTypes.number,
  expirydates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      expirydate: PropTypes.string,
      quantityopen: PropTypes.number,
      quantityunopened: PropTypes.number,
      item: PropTypes.number,
      archived: PropTypes.bool,
    }),
  ),
});

export const CartItemPropType = PropTypes.shape({
  ...ItemPropType,
  type: PropTypes.string,
  expiryId: PropTypes.number,
  cartOpenedQuantity: PropTypes.number,
  cartUnopenedQuantity: PropTypes.number,
});

export const UserPropType = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  profilepic: PropTypes.string,
  role: PropTypes.string,
  user: PropTypes.number,
});

export const ItemFormDataPropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  total_quantityopen: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  total_quantityunopened: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  min_quantityopen: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  min_quantityunopened: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
});

export const ExpiryFormDataPropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  expiry: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      total_quantityopen: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]).isRequired,
      total_quantityunopened: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]).isRequired,
    }),
  ).isRequired,
  min_quantityopen: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  min_quantityunopened: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
});

// API Endpoints
export const INV_API_BASE_URL = '/inventory/api';
export const INV_API_ITEMS_URL = `${INV_API_BASE_URL}/items`;
export const INV_API_USER_URL = `${INV_API_BASE_URL}/user`;
export const INV_API_SUBMIT_ORDER_URL = `${INV_API_BASE_URL}/submit_order`;
export const INV_API_EXPIRY_POST_URL = `${INV_API_BASE_URL}/add_expiry_post`;
export const INV_API_LOANS_URL = `${INV_API_BASE_URL}/loans`;
export const INV_API_LOAN_RETURN_URL = `${INV_API_BASE_URL}/loan_return_post`;
