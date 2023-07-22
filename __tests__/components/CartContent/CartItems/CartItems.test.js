import { render, screen } from '@testing-library/react';
import React from 'react';

import { CartItems } from '../../../../components/CartContent/CartItems/CartItems';
import { CartContext } from '../../../../components/CartContext';
import { mockDepositCart, mockWithdrawCart } from '../../../../mocks/cart';

const setCartState = jest.fn();
const setCartItems = jest.fn();

const mockContextValue = {
  cartState: '',
  setCartState: setCartState,
  cartItems: [],
  setCartItems: setCartItems,
};

describe('<CartItems />', () => {
  it('correctly renders all withdraw cart items', () => {
    const withdrawContextValue = {
      ...mockContextValue,
      cartState: 'Withdraw',
      cartItems: mockWithdrawCart,
    };
    render(
      <CartContext.Provider value={withdrawContextValue}>
        <CartItems />
      </CartContext.Provider>,
    );

    for (const item of mockWithdrawCart) {
      expect(
        screen.getByRole('heading', { name: item.name }),
      ).toBeInTheDocument();
    }
  });

  it('correctly renders all deposit cart items', () => {
    const depositContextValue = {
      ...mockContextValue,
      cartState: 'Deposit',
      cartItems: mockDepositCart,
    };
    render(
      <CartContext.Provider value={depositContextValue}>
        <CartItems />
      </CartContext.Provider>,
    );

    for (const item of mockDepositCart) {
      expect(
        screen.getByRole('heading', { name: item.name }),
      ).toBeInTheDocument();
    }
  });
});
