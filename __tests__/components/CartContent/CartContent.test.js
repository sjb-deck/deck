import { screen } from '@testing-library/react';
import React from 'react';

import { CartContent } from '../../../components/CartContent/CartContent';
import { emptyCartMessage } from '../../../components/CartContent/labels';
import { Api } from '../../../globals';
import {
  mockDepositOrder,
  mockLoanOrder,
  mockWithdrawOrder,
} from '../../../mocks';
import { mockDepositCart, mockWithdrawCart } from '../../../mocks/cart';
import { render, userEvent } from '../../../testSetup';

const mockContextValue = {
  cartState: '',
  cartItems: [],
};

describe('<CartContent />', () => {
  describe('renders correctly', () => {
    it('for empty cart', () => {
      render(<CartContent />, { cartContext: mockContextValue });

      expect(screen.getByText(emptyCartMessage)).toBeInTheDocument();
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
    it('loan withdrawal order', async () => {
      const withdrawContextValue = {
        cartState: 'Withdraw',
        cartItems: mockWithdrawCart,
      };

      render(<CartContent />, {
        cartContext: withdrawContextValue,
      });

      await userEvent.click(
        screen.getByRole('button', { name: /Withdraw Options/ }),
      );
      await userEvent.click(screen.getByRole('option', { name: 'Loan' }));
      expect(
        screen.getByRole('button', { name: 'Withdraw Options Loan' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('textbox', { name: 'Loanee Name' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('textbox', { name: 'Return Date' }),
      ).toBeInTheDocument();
    });

    it('unserviceable withdrawal order', async () => {
      const withdrawContextValue = {
        cartState: 'Withdraw',
        cartItems: mockWithdrawCart,
      };

      render(<CartContent />, {
        cartContext: withdrawContextValue,
      });

      await userEvent.click(
        screen.getByRole('button', { name: /Withdraw Options/ }),
      );
      await userEvent.click(
        screen.getByRole('option', { name: 'Unserviceable' }),
      );
      expect(
        screen.getByRole('button', { name: 'Withdraw Options Unserviceable' }),
      ).toBeInTheDocument();
    });

    it('others withdrawal order', async () => {
      const withdrawContextValue = {
        cartState: 'Withdraw',
        cartItems: mockWithdrawCart,
      };

      render(<CartContent />, {
        cartContext: withdrawContextValue,
      });

      await userEvent.click(
        screen.getByRole('button', { name: /Withdraw Options/ }),
      );
      await userEvent.click(screen.getByRole('option', { name: 'Others' }));
      expect(
        screen.getByRole('button', { name: 'Withdraw Options Others' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('textbox', { name: 'Reason' }),
      ).toBeInTheDocument();
    });

    it('restocking deposit order', async () => {
      const depositContextValue = {
        cartState: 'Deposit',
        cartItems: mockDepositCart,
      };

      render(<CartContent />, { cartContext: depositContextValue });

      await userEvent.click(
        screen.getByRole('button', { name: /Deposit Options/ }),
      );
      await userEvent.click(
        screen.getByRole('option', { name: 'Restocking of Stocks' }),
      );
      expect(
        screen.getByRole('button', {
          name: 'Deposit Options Restocking of Stocks',
        }),
      ).toBeInTheDocument();
    });

    it('others deposit order', async () => {
      const depositContextValue = {
        cartState: 'Deposit',
        cartItems: mockDepositCart,
      };

      render(<CartContent />, { cartContext: depositContextValue });

      await userEvent.click(
        screen.getByRole('button', { name: /Deposit Options/ }),
      );
      await userEvent.click(screen.getByRole('option', { name: 'Others' }));
      expect(
        screen.getByRole('button', {
          name: 'Deposit Options Others',
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('textbox', { name: 'Reason' }),
      ).toBeInTheDocument();
    });
  });

  describe('submits the correct payload when it is a ', () => {
    it('loan withdrawal order', async () => {
      const withdrawContextValue = {
        cartState: 'Withdraw',
        cartItems: mockWithdrawCart,
      };

      render(<CartContent />, {
        cartContext: withdrawContextValue,
      });

      await userEvent.click(
        screen.getByRole('button', { name: /Withdraw Options/ }),
      );
      await userEvent.click(screen.getByRole('option', { name: 'Loan' }));
      await userEvent.type(
        screen.getByRole('textbox', { name: 'Loanee Name' }),
        'Jesper Fan',
      );
      expect(screen.getByRole('textbox', { name: 'Loanee Name' })).toHaveValue(
        'Jesper Fan',
      );
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
      expect(formik.handleSubmit).toHaveBeenCalledWith();
    });

    it.todo('loan withdrawal order');

    it.todo('unserviceable withdrawal order');

    it.todo('others withdrawal order');

    it.todo('restocking deposit order');

    it.todo('others deposit order');
  });
});
