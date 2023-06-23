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

// API Endpoints
export const INV_API_BASE_URL = '/inventory/api';
export const INV_API_ITEMS_URL = `${INV_API_BASE_URL}/items`;
export const INV_API_USER_URL = `${INV_API_BASE_URL}/user`;
