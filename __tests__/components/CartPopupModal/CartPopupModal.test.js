import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import React from 'react';

import { CartContext } from '../../../components/CartContext';
import CartPopupModal from '../../../components/CartPopupModal/CartPopupModal';
import {
  CART_ITEM_TYPE_DEPOSIT,
  CART_ITEM_TYPE_WITHDRAW,
  LOCAL_STORAGE_CART_KEY,
} from '../../../globals';
import {
  mockDepositCartContext,
  mockWithdrawCartContext,
} from '../../../mocks/context';
import { exampleItem } from '../../../mocks/items';

describe('CartPopupModal', () => {
  it('renders without crashing', () => {
    render(
      <CartContext.Provider value={mockDepositCartContext}>
        <CartPopupModal
          type={CART_ITEM_TYPE_DEPOSIT}
          item={exampleItem}
          selector='All'
          setCartState={jest.fn}
        />
      </CartContext.Provider>,
    );
  });

  it('displays the Deposit button when type is Deposit', () => {
    render(
      <CartContext.Provider value={mockDepositCartContext}>
        <CartPopupModal
          type={CART_ITEM_TYPE_DEPOSIT}
          item={exampleItem}
          selector='All'
          setCartState={jest.fn}
        />
      </CartContext.Provider>,
    );
    expect(screen.getByText(CART_ITEM_TYPE_DEPOSIT)).toBeInTheDocument();
  });

  it('displays the Withdraw button when type is Withdraw', () => {
    render(
      <CartContext.Provider value={mockWithdrawCartContext}>
        <CartPopupModal
          type={CART_ITEM_TYPE_WITHDRAW}
          item={exampleItem}
          selector='All'
          setCartState={jest.fn}
        />
      </CartContext.Provider>,
    );
    expect(screen.getByText(CART_ITEM_TYPE_WITHDRAW)).toBeInTheDocument();
  });

  it('opens the modal when the button is clicked', () => {
    render(
      <CartContext.Provider value={mockDepositCartContext}>
        <CartPopupModal
          type={CART_ITEM_TYPE_DEPOSIT}
          item={exampleItem}
          selector='All'
          setCartState={jest.fn}
        />
      </CartContext.Provider>,
    );
    fireEvent.click(screen.getByText(CART_ITEM_TYPE_DEPOSIT));
    expect(screen.getByText(exampleItem.name)).toBeInTheDocument();
  });

  it('displays the correct item name', () => {
    render(
      <CartContext.Provider value={mockDepositCartContext}>
        <CartPopupModal
          type={CART_ITEM_TYPE_DEPOSIT}
          item={exampleItem}
          selector='All'
          setCartState={jest.fn}
        />
      </CartContext.Provider>,
    );
    fireEvent.click(screen.getByText(CART_ITEM_TYPE_DEPOSIT));
    expect(screen.getByText(exampleItem.name)).toBeInTheDocument();
  });

  it('displays the dropdown when there are multiple expiry dates', async () => {
    const mockItemWithDates = {
      ...exampleItem,
      expirydates: [
        { expirydate: '2024-06-11', id: 1 },
        { expirydate: '2024-06-12', id: 2 },
      ],
    };
    render(
      <CartContext.Provider value={mockDepositCartContext}>
        <CartPopupModal
          type={CART_ITEM_TYPE_DEPOSIT}
          item={mockItemWithDates}
          selector='All'
          setCartState={jest.fn}
        />
      </CartContext.Provider>,
    );
    fireEvent.click(screen.getByText(CART_ITEM_TYPE_DEPOSIT));
    expect(
      screen.getByRole('button', {
        name: `Expiry Date ${mockItemWithDates.expirydates[0].expirydate}`,
      }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Expiry Date'));
    expect(
      screen.getByDisplayValue(
        `${mockItemWithDates.expirydates[0].expirydate}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', {
        name: `${mockItemWithDates.expirydates[1].expirydate}`,
      }),
    ).toBeInTheDocument();
  });

  it('updates selectedExpiry when a date is clicked', async () => {
    const mockItemWithDates = {
      ...exampleItem,
      expirydates: [
        { expirydate: '2024-06-11', id: 1 },
        { expirydate: '2024-06-12', id: 2 },
      ],
    };
    render(
      <CartContext.Provider value={mockDepositCartContext}>
        <CartPopupModal
          type={CART_ITEM_TYPE_DEPOSIT}
          item={mockItemWithDates}
          selector='All'
          setCartState={jest.fn}
        />
      </CartContext.Provider>,
    );
    await userEvent.click(screen.getByText(CART_ITEM_TYPE_DEPOSIT));
    await userEvent.click(
      screen.getByRole('button', {
        name: `Expiry Date ${mockItemWithDates.expirydates[0].expirydate}`,
      }),
    );
    const btnList = screen.queryAllByRole('option', { hidden: true });
    const button = btnList.find(
      (btn) =>
        btn.getAttribute('data-value') ===
        `${mockItemWithDates.expirydates[1].expirydate}`,
    );
    await userEvent.click(button, { hidden: true });
    expect(
      screen.getByRole('button', {
        name: `Expiry Date ${mockItemWithDates.expirydates[1].expirydate}`,
      }),
    ).toBeInTheDocument();
  });

  it('display calendar when New is clicked and update selected date', async () => {
    const mockItemWithDates = {
      ...exampleItem,
      expirydates: [
        { expirydate: '2024-06-11', id: 1 },
        { expirydate: '2024-06-12', id: 2 },
      ],
    };
    render(
      <CartContext.Provider value={mockDepositCartContext}>
        <CartPopupModal
          type={CART_ITEM_TYPE_DEPOSIT}
          item={mockItemWithDates}
          selector='All'
          setCartState={jest.fn}
        />
      </CartContext.Provider>,
    );
    await userEvent.click(screen.getByText(CART_ITEM_TYPE_DEPOSIT));
    await userEvent.click(
      screen.getByRole('button', {
        name: `Expiry Date ${mockItemWithDates.expirydates[0].expirydate}`,
      }),
    );
    const btnList = screen.queryAllByRole('option', { hidden: true });
    const button = btnList.find(
      (btn) => btn.getAttribute('data-value') === 'New',
    );
    await userEvent.click(button, { hidden: true });
    expect(screen.getByText('Pick a new expiry date')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Ok',
      }),
    ).toBeInTheDocument();
    const dateBtnList = screen.queryAllByText(dayjs().get('date'));
    const dateButton = dateBtnList.find(
      (btn) => btn.getAttribute('role') === 'gridcell',
    );
    expect(dateButton).toBeInTheDocument();
    await userEvent.click(dateButton);
    await userEvent.click(screen.getByText('Ok'));
    await waitFor(() => {
      const modal = screen.queryByText('Pick a new expiry date');
      expect(modal).toBeNull(); // Ensure that the modal content is no longer in the document
    });
    expect(
      screen.getByRole('button', {
        name: `Expiry Date ${dayjs().format('YYYY-MM-DD')}`,
      }),
    ).toBeInTheDocument();
  });

  it('renders the text fields with the correct labels', async () => {
    render(
      <CartContext.Provider value={mockDepositCartContext}>
        <CartPopupModal
          type={CART_ITEM_TYPE_DEPOSIT}
          item={exampleItem}
          selector='All'
          setCartState={jest.fn}
        />
      </CartContext.Provider>,
    );
    await userEvent.click(screen.getByText(CART_ITEM_TYPE_DEPOSIT));
    expect(screen.getByText('Opened Qty')).toBeInTheDocument();
    expect(screen.getByText('Unopened Qty')).toBeInTheDocument();
  });

  it('displays an error message when the field has negative numbers', async () => {
    const item = exampleItem;
    render(
      <CartContext.Provider value={mockDepositCartContext}>
        <CartPopupModal
          type={CART_ITEM_TYPE_DEPOSIT}
          item={item}
          selector='All'
          setCartState={jest.fn}
        />
      </CartContext.Provider>,
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
        <CartContext.Provider value={mockDepositCartContext}>
          <CartPopupModal
            type={CART_ITEM_TYPE_DEPOSIT}
            item={item}
            selector='All'
            setCartState={jest.fn}
          />
        </CartContext.Provider>,
      );

      await userEvent.click(screen.getByText(/Deposit/i));

      const openedQtyInput = screen.getByLabelText('Opened Qty');
      await userEvent.clear(openedQtyInput);
      await userEvent.type(openedQtyInput, '1');

      const depositButton = screen.getByRole('submit-button');
      await userEvent.click(depositButton);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_CART_KEY,
        JSON.stringify([...mockDepositCartContext.cartItems, ...expectedItem]),
      );
    });

    it('does not update localstorage when fields are all 0', async () => {
      const item = exampleItem;
      render(
        <CartContext.Provider value={mockDepositCartContext}>
          <CartPopupModal
            type={CART_ITEM_TYPE_DEPOSIT}
            item={item}
            selector='All'
            setCartState={jest.fn}
          />
        </CartContext.Provider>,
      );

      await userEvent.click(screen.getByText(/Deposit/i));

      const depositButton = screen.getByRole('submit-button');
      await userEvent.click(depositButton);

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });
});
