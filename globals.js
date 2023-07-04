import { PropTypes } from 'prop-types';

// Globals
export const URL_INV_INDEX = '/inventory';
export const URL_LOGOUT = '/logout';
export const URL_PROFILE = '/accounts/edit';
export const URL_INV_CART = '/inventory/cart';
export const URL_INV_ALERTS = '/inventory/alerts';
export const ITEMS_PER_PAGE = 5;

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
export const INV_API_ITEM_POST_URL = `${INV_API_BASE_URL}/add_item_post`;
export const INV_API_EXPIRY_POST_URL = `${INV_API_BASE_URL}/add_expiry_post`;
