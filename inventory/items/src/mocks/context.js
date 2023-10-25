import { CART_ITEM_TYPE_DEPOSIT, CART_ITEM_TYPE_WITHDRAW } from '../../../src/globals';

import { mockDepositCart, mockWithdrawCart } from './cart';

export const mockCartContext = {
  cartState: '',
  cartItems: [],
};

export const mockDepositCartContext = {
  cartState: CART_ITEM_TYPE_DEPOSIT,
  cartItems: mockDepositCart,
};

export const mockWithdrawCartContext = {
  cartState: CART_ITEM_TYPE_WITHDRAW,
  cartItems: mockWithdrawCart,
};
