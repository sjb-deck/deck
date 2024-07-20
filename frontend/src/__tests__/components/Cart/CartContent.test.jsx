import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CartContent } from '../../../components';
import { mockDepositCart, mockWithdrawCart } from '../../../mocks/cart';
import { render } from '../../../testSetup';

const mockContextValue = {
  cartState: '',
  cartItems: [],
};

describe('<CartContent />', () => {
  describe('renders correctly', () => {
    it('for empty cart', () => {
      render(<CartContent />, { cartContext: mockContextValue });

      expect(
        screen.getByText(
          'The cart is empty, deposit/withdraw items and it will appear here',
        ),
      ).toBeInTheDocument();
    });
    it('for withdrawal cart', () => {
      const withdrawContextValue = {
        cartState: 'Withdraw',
        cartItems: mockWithdrawCart,
      };

      render(<CartContent />, { cartContext: withdrawContextValue });

      expect(screen.getByText('Withdraw Cart')).toBeInTheDocument();
    });

    it('for deposit cart', () => {
      const depositContextValue = {
        cartState: 'Deposit',
        cartItems: mockDepositCart,
      };

      render(<CartContent />, { cartContext: depositContextValue });

      expect(screen.getByText('Deposit Cart')).toBeInTheDocument();
    });
  });

  describe('renders the correct fields when it is a ', () => {
    it.todo('loan withdrawal order');

    it.todo('unserviceable withdrawal order');

    it.todo('others withdrawal order');

    it.todo('restocking deposit order');

    it.todo('others deposit order');
  });

  describe('submits the correct payload when it is a ', () => {
    it.todo('loan withdrawal order');

    it.todo('unserviceable withdrawal order');

    it.todo('others withdrawal order');

    it.todo('restocking deposit order');

    it.todo('others deposit order');
  });
});
