import { screen } from '@testing-library/react';
import React from 'react';

import { EditCartItemPopUp } from '../../../../components/CartContent/EditPopUp/EditCartItemPopUp';
import { LOCAL_STORAGE_CART_KEY } from '../../../../globals';
import { mockDepositCart, mockWithdrawCart } from '../../../../mocks/cart';
import { render, userEvent } from '../../../../testSetup';

describe('<EditCartItemPopUp />', () => {
  beforeEach(() => {
    setItemSpy = jest.fn();
    global.localStorage.__proto__.setItem = setItemSpy;
    global.localStorage.__proto__.getItem = jest.fn(() =>
      JSON.stringify(mockDepositCart),
    );
  });

  afterEach(() => {
    setItemSpy.mockClear();
  });
  it('renders correctly', () => {
    const mockCartItem = mockDepositCart[0];
    render(
      <EditCartItemPopUp
        cartItem={mockCartItem}
        open={true}
        handleClose={jest.fn()}
      />,
    );

    expect(screen.getByText(mockCartItem.name)).toBeInTheDocument();
    expect(screen.getByLabelText('Expiry Date')).toHaveValue(
      mockCartItem.expiry_dates[0].expiry_date ?? 'No Expiry',
    );
    expect(screen.getByLabelText('Quantity')).toHaveValue(
      mockCartItem.cartQuantity,
    );
    expect(screen.getByRole('submit-button')).toBeInTheDocument();
  });

  it('updates the localstorage correctly', async () => {
    const mockCartItem = mockDepositCart[0];
    render(
      <EditCartItemPopUp
        cartItem={mockCartItem}
        open={true}
        handleClose={jest.fn()}
      />,
    );

    expect(screen.getByLabelText('Quantity')).toHaveValue(
      mockCartItem.cartQuantity,
    );
    await userEvent.clear(screen.getByLabelText('Quantity'));
    await userEvent.type(screen.getByLabelText('Quantity'), '1');
    expect(screen.getByLabelText('Quantity')).toHaveValue(1);
    await userEvent.click(screen.getByRole('submit-button'));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      LOCAL_STORAGE_CART_KEY,
      JSON.stringify([
        {
          ...mockCartItem,
          cartQuantity: 1,
        },
        ...mockDepositCart.slice(1),
      ]),
    );
  });

  it('does not submit when quantity is invalid', async () => {
    const mockCartItem = mockDepositCart[0];
    render(
      <EditCartItemPopUp
        cartItem={mockCartItem}
        open={true}
        handleClose={jest.fn()}
      />,
    );

    expect(screen.getByLabelText('Quantity')).toHaveValue(
      mockCartItem.cartQuantity,
    );
    await userEvent.clear(screen.getByLabelText('Quantity'));
    await userEvent.type(screen.getByLabelText('Quantity'), '0');
    await userEvent.click(screen.getByRole('submit-button'));
    expect(
      screen.getByText('Number must be greater than 0'),
    ).toBeInTheDocument();

    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('does not submit when quantity is more than available', async () => {
    const mockCartItem = mockWithdrawCart[0];
    render(
      <EditCartItemPopUp
        cartItem={mockCartItem}
        open={true}
        handleClose={jest.fn()}
      />,
    );

    expect(screen.getByLabelText('Quantity')).toHaveValue(
      mockCartItem.cartQuantity,
    );
    await userEvent.clear(screen.getByLabelText('Quantity'));
    await userEvent.type(screen.getByLabelText('Quantity'), '100');
    expect(screen.getByLabelText('Quantity')).toHaveValue(100);
    await userEvent.click(screen.getByRole('submit-button'));
    expect(
      screen.getByText('Withdraw quantity is more than what is available'),
    ).toBeInTheDocument();

    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});
