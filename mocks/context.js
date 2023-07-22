import { CART_ITEM_TYPE_DEPOSIT, CART_ITEM_TYPE_WITHDRAW } from '../globals';

import { mockDepositCart, mockWithdrawCart } from './cart';

export const mockCartContext = {
  cartState: '',
  setCartState: () => {},
  cartItems: [],
  setCartItems: () => {},
};

export const mockDepositCartContext = {
  cartState: CART_ITEM_TYPE_DEPOSIT,
  setCartState: () => {},
  cartItems: mockDepositCart,
  setCartItems: () => {},
};

export const mockWithdrawCartContext = {
  cartState: CART_ITEM_TYPE_WITHDRAW,
  setCartState: () => {},
  cartItems: mockWithdrawCart,
  setCartItems: () => {},
};
