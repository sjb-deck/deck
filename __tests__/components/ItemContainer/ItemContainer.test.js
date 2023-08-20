import { screen } from '@testing-library/react';
import React from 'react';

import { ItemContainer } from '../../../components/ItemContainer/ItemContainer';
import { CART_ITEM_TYPE_WITHDRAW } from '../../../globals';
import { exampleItem, mockDepositCart } from '../../../mocks';
import { render, userEvent } from '../../../testSetup';

describe('ItemContainer', () => {
  it('renders the component correctly', () => {
    render(<ItemContainer index={0} item={exampleItem} />);

    expect(screen.getByText(exampleItem.name)).toBeInTheDocument();
    expect(screen.getByText('Unit: ' + exampleItem.unit)).toBeInTheDocument();
    expect(
      screen.getByText('Quantity: ' + exampleItem.total_quantity),
    ).toBeInTheDocument();
  });

  it('handles expiry date changes', async () => {
    render(<ItemContainer index={0} item={exampleItem} />);
    await userEvent.click(screen.getByText('All'));
    expect(
      screen.getByText('Quantity: ' + exampleItem.total_quantity),
    ).toBeInTheDocument();
    const expiryItem = exampleItem.expiry_dates[0];
    await userEvent.click(screen.getByText(expiryItem.expiry_date));
    expect(
      screen.getByText('Quantity: ' + expiryItem.quantity),
    ).toBeInTheDocument();
  });

  it('disable the withdraw button when cart is of deposit type', () => {
    const mockDepositContextValue = {
      cartState: 'Deposit',
      cartItems: mockDepositCart,
    };
    render(<ItemContainer index={0} item={exampleItem} />, {
      cartContext: mockDepositContextValue,
    });

    expect(screen.getByText(CART_ITEM_TYPE_WITHDRAW)).toBeDisabled();
  });
});
