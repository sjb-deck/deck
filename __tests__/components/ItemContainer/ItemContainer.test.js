import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import '@testing-library/jest-dom';
import { CartContext, CartProvider } from '../../../components/CartContext';
import ItemContainer from '../../../components/ItemContainer/ItemContainer';
import { CART_ITEM_TYPE_WITHDRAW } from '../../../globals';
import { mockDepositCart } from '../../../mocks/cart';
import { exampleItem } from '../../../mocks/items';

describe('ItemContainer', () => {
  it('renders the component correctly', () => {
    render(
      <CartProvider>
        <ItemContainer index={0} item={exampleItem} />
      </CartProvider>,
    );

    expect(screen.getByText(exampleItem.name)).toBeInTheDocument();
    expect(screen.getByText('Unit: ' + exampleItem.unit)).toBeInTheDocument();
    expect(
      screen.getByText('Quantity: ' + exampleItem.total_quantity),
    ).toBeInTheDocument();
  });

  it('handles expiry date changes', async () => {
    render(
      <CartProvider>
        <ItemContainer index={0} item={exampleItem} />
      </CartProvider>,
    );
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
      setCartState: () => {},
      cartItems: mockDepositCart,
      setCartItems: () => {},
    };
    render(
      <CartContext.Provider value={mockDepositContextValue}>
        <ItemContainer index={0} item={exampleItem} />
      </CartContext.Provider>,
    );

    expect(screen.getByText(CART_ITEM_TYPE_WITHDRAW)).toBeDisabled();
  });
});
