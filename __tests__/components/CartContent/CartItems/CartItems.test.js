import { screen } from '@testing-library/react';
import React from 'react';

import { CartItems } from '../../../../components/CartContent/CartItems/CartItems';
import { mockDepositCart, mockWithdrawCart } from '../../../../mocks/cart';
import { render } from '../../../../testSetup';

describe('<CartItems />', () => {
  it('correctly renders all withdraw cart items', () => {
    const withdrawContextValue = {
      cartState: 'Withdraw',
      cartItems: mockWithdrawCart,
    };
    render(<CartItems />, { cartContext: withdrawContextValue });

    for (const item of mockWithdrawCart) {
      expect(
        screen.getByRole('heading', { name: item.name }),
      ).toBeInTheDocument();
    }
  });

  it('correctly renders all deposit cart items', () => {
    const depositContextValue = {
      cartState: 'Deposit',
      cartItems: mockDepositCart,
    };
    render(<CartItems />, { cartContext: depositContextValue });

    for (const item of mockDepositCart) {
      expect(
        screen.getByRole('heading', { name: item.name }),
      ).toBeInTheDocument();
    }
  });
});
