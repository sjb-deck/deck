import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import '@testing-library/jest-dom';
import { CartProvider } from '../../../components/CartContext';
import ItemContainer from '../../../components/ItemContainer/ItemContainer';
import {
  CART_ITEM_TYPE_DEPOSIT,
  CART_ITEM_TYPE_WITHDRAW,
} from '../../../globals';
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
      screen.getByText(
        'Total Qty: ' +
          (Number(exampleItem.total_quantityopen) +
            Number(exampleItem.total_quantityunopened)),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Opened Qty: ' + exampleItem.total_quantityopen),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Unopened Qty: ' + exampleItem.total_quantityunopened),
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
      screen.getByText(
        'Total Qty: ' +
          (Number(exampleItem.total_quantityopen) +
            Number(exampleItem.total_quantityunopened)),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Opened Qty: ' + exampleItem.total_quantityopen),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Opened Qty: ' + exampleItem.total_quantityunopened),
    ).toBeInTheDocument();
    const expiryItem = exampleItem.expirydates[0];
    await userEvent.click(screen.getByText(expiryItem.expirydate));
    expect(
      screen.getByText(
        'Total Qty: ' + (expiryItem.quantityopen + expiryItem.quantityunopened),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Opened Qty: ' + expiryItem.quantityopen),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Unopened Qty: ' + expiryItem.quantityunopened),
    ).toBeInTheDocument();
  });

  it('disable the withdraw button when cart is of deposit type', () => {
    render(
      <CartProvider initialState={CART_ITEM_TYPE_DEPOSIT}>
        <ItemContainer index={0} item={exampleItem} />
      </CartProvider>,
    );

    expect(screen.getByText(CART_ITEM_TYPE_WITHDRAW)).toBeDisabled();
  });
});
