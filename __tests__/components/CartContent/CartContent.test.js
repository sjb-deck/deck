import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { render, screen } from '@testing-library/react';
import React from 'react';

import CartContent from '../../../components/CartContent/CartContent';
import { emptyCartMessage } from '../../../components/CartContent/labels';
import { CartContext } from '../../../components/CartContext';
import { mockDepositCart, mockWithdrawCart } from '../../../mocks/cart';

const setCartState = jest.fn();
const setCartItems = jest.fn();

const mockContextValue = {
  cartState: '',
  setCartState: setCartState,
  cartItems: [],
  setCartItems: setCartItems,
};

describe('<CartContent />', () => {
  describe('renders correctly', () => {
    it('for empty cart', () => {
      render(
        <CartContext.Provider value={mockContextValue}>
          <CartContent />
        </CartContext.Provider>,
      );

      expect(screen.getByText(emptyCartMessage)).toBeInTheDocument();
    });
    it('for withdrawal cart', () => {
      const withdrawContextValue = {
        ...mockContextValue,
        cartState: 'Withdraw',
        cartItems: mockWithdrawCart,
      };

      render(
        <CartContext.Provider value={withdrawContextValue}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CartContent />
          </LocalizationProvider>
        </CartContext.Provider>,
      );

      expect(screen.getByText('Withdraw Cart')).toBeInTheDocument();
    });

    it('for deposit cart', () => {
      const depositContextValue = {
        ...mockContextValue,
        cartState: 'Deposit',
        cartItems: mockDepositCart,
      };

      render(
        <CartContext.Provider value={depositContextValue}>
          <CartContent />
        </CartContext.Provider>,
      );

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
