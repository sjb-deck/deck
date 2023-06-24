import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import '@testing-library/jest-dom';
import {
  CART_ITEM_TYPE_DEPOSIT,
  CART_ITEM_TYPE_WITHDRAW,
  LOCAL_STORAGE_CART_KEY,
} from '../../globals';
import { exampleItem } from '../../inventory/src/mocks/items';

import CartPopupModal from './CartPopupModal';

describe('CartPopupModal', () => {
  const mockItem = {
    name: 'Test Item',
    expirydates: [],
    imgpic: '',
    unit: 'pieces',
  };

  it('renders without crashing', () => {
    render(
      <CartPopupModal
        type={CART_ITEM_TYPE_DEPOSIT}
        item={mockItem}
        selector='All'
        setCartState={jest.fn}
      />,
    );
  });

  it('displays the Deposit button when type is Deposit', () => {
    render(
      <CartPopupModal
        type={CART_ITEM_TYPE_DEPOSIT}
        item={mockItem}
        selector='All'
        setCartState={jest.fn}
      />,
    );
    expect(screen.getByText(CART_ITEM_TYPE_DEPOSIT)).toBeInTheDocument();
  });

  it('displays the Withdraw button when type is Withdraw', () => {
    render(
      <CartPopupModal
        type={CART_ITEM_TYPE_WITHDRAW}
        item={mockItem}
        selector='All'
        setCartState={jest.fn}
      />,
    );
    expect(screen.getByText(CART_ITEM_TYPE_WITHDRAW)).toBeInTheDocument();
  });

  it('opens the modal when the button is clicked', () => {
    render(
      <CartPopupModal
        type={CART_ITEM_TYPE_DEPOSIT}
        item={mockItem}
        selector='All'
        setCartState={jest.fn}
      />,
    );
    fireEvent.click(screen.getByText(CART_ITEM_TYPE_DEPOSIT));
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('displays the correct item name', () => {
    render(
      <CartPopupModal
        type={CART_ITEM_TYPE_DEPOSIT}
        item={mockItem}
        selector='All'
        setCartState={jest.fn}
      />,
    );
    fireEvent.click(screen.getByText(CART_ITEM_TYPE_DEPOSIT));
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('displays the dropdown when there are multiple expiry dates', () => {
    const mockItemWithDates = {
      ...mockItem,
      expirydates: [
        { expirydate: '2024-06-11', id: 1 },
        { expirydate: '2024-06-12', id: 2 },
      ],
    };
    render(
      <CartPopupModal
        type={CART_ITEM_TYPE_DEPOSIT}
        item={mockItemWithDates}
        selector='All'
        setCartState={jest.fn}
      />,
    );
    fireEvent.click(screen.getByText(CART_ITEM_TYPE_DEPOSIT));
    fireEvent.click(
      screen.getByRole('chip', {
        name: mockItemWithDates.expirydates[0].expirydate,
      }),
    );
    expect(
      screen.getByRole('menuitem', {
        name: mockItemWithDates.expirydates[1].expirydate,
      }),
    ).toBeInTheDocument();
  });

  it('updates selectedExpiry when a date is clicked', async () => {
    const mockItemWithDates = {
      ...mockItem,
      expirydates: [
        { expirydate: '2024-06-11', id: 1 },
        { expirydate: '2024-06-12', id: 2 },
      ],
    };
    render(
      <CartPopupModal
        type={CART_ITEM_TYPE_DEPOSIT}
        item={mockItemWithDates}
        selector='All'
        setCartState={jest.fn}
      />,
    );
    await userEvent.click(screen.getByText(CART_ITEM_TYPE_DEPOSIT));
    await userEvent.click(
      screen.getByRole('chip', {
        name: mockItemWithDates.expirydates[0].expirydate,
      }),
    );
    await userEvent.click(
      screen.getByRole('menuitem', {
        name: mockItemWithDates.expirydates[1].expirydate,
      }),
    );
    expect(
      screen.getByRole('chip', {
        name: mockItemWithDates.expirydates[1].expirydate,
      }),
    ).toBeInTheDocument();
  });

  it('renders the text fields with the correct labels', async () => {
    render(
      <CartPopupModal
        type={CART_ITEM_TYPE_DEPOSIT}
        item={mockItem}
        selector='All'
        setCartState={jest.fn}
      />,
    );
    await userEvent.click(screen.getByText(CART_ITEM_TYPE_DEPOSIT));
    expect(screen.getByText('Opened Qty')).toBeInTheDocument();
    expect(screen.getByText('Unopened Qty')).toBeInTheDocument();
  });

  it('displays an error message when the field has negative numbers', async () => {
    const item = exampleItem;
    render(
      <CartPopupModal
        type={CART_ITEM_TYPE_DEPOSIT}
        item={item}
        selector='All'
        setCartState={jest.fn}
      />,
    );

    await userEvent.click(screen.getByText(/Deposit/i));

    const openedQtyInput = screen.getByLabelText(/Opened Qty/i);

    await userEvent.clear(openedQtyInput);
    await userEvent.type(openedQtyInput, '-1');
    await userEvent.click(screen.getByRole('submit-button'));

    expect(screen.getByText(/Number cannot be negative/i)).toBeInTheDocument();
  });

  describe('Updates localstorage correctly', () => {
    beforeEach(() => {
      setItemSpy = jest.fn();
      global.localStorage.__proto__.setItem = setItemSpy;
    });

    afterEach(() => {
      setItemSpy.mockClear();
    });

    it('adds to localstorage when the form is submitted correctly', async () => {
      const item = exampleItem;
      const expectedItem = [
        {
          ...item,
          expiryId: item.expirydates[0].id,
          type: CART_ITEM_TYPE_DEPOSIT,
          cartOpenedQuantity: 1,
          cartUnopenedQuantity: 0,
        },
      ];

      render(
        <CartPopupModal
          type={CART_ITEM_TYPE_DEPOSIT}
          item={item}
          selector='All'
          setCartState={jest.fn}
        />,
      );

      await userEvent.click(screen.getByText(/Deposit/i));

      const openedQtyInput = screen.getByLabelText('Opened Qty');
      await userEvent.clear(openedQtyInput);
      await userEvent.type(openedQtyInput, '1');

      const depositButton = screen.getByRole('submit-button');
      await userEvent.click(depositButton);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_CART_KEY,
        JSON.stringify(expectedItem),
      );
    });

    it('does not update localstorage when fields are all 0', async () => {
      const item = exampleItem;
      render(
        <CartPopupModal
          type={CART_ITEM_TYPE_DEPOSIT}
          item={item}
          selector='All'
          setCartState={jest.fn}
        />,
      );

      await userEvent.click(screen.getByText(/Deposit/i));

      const depositButton = screen.getByRole('submit-button');
      await userEvent.click(depositButton);

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });
});
