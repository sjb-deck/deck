import '@testing-library/jest-dom';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import dayjs from 'dayjs';
import React from 'react';

import { CartPopupModal } from '../../../../components/ItemIndex/CartPopupModal';
import {
  CART_ITEM_TYPE_DEPOSIT,
  CART_ITEM_TYPE_WITHDRAW,
  LOCAL_STORAGE_CART_KEY,
} from '../../../../globals';
import {
  exampleItem,
  mockDepositCartContext,
  mockWithdrawCartContext,
} from '../../../../mocks';
import { render, userEvent } from '../../../../testSetup';

describe('CartPopupModal', () => {
  it('renders without crashing', () => {
    render(
      <CartPopupModal
        type={CART_ITEM_TYPE_DEPOSIT}
        item={exampleItem}
        selector='All'
        open={true}
        setOpen={jest.fn()}
      />,
      { cartContext: mockDepositCartContext },
    );
  });

  it('displays the Deposit button when type is Deposit', () => {
    render(
      <CartPopupModal
        type={CART_ITEM_TYPE_DEPOSIT}
        item={exampleItem}
        selector='All'
        open={true}
        setOpen={jest.fn()}
      />,
      { cartContext: mockDepositCartContext },
    );
    expect(screen.getByText(CART_ITEM_TYPE_DEPOSIT)).toBeInTheDocument();
  });

  it('displays the Withdraw button when type is Withdraw', () => {
    render(
      <CartPopupModal
        type={CART_ITEM_TYPE_WITHDRAW}
        item={exampleItem}
        selector='All'
        open={true}
        setOpen={jest.fn()}
      />,
      { cartContext: mockWithdrawCartContext },
    );
    expect(screen.getByText(CART_ITEM_TYPE_WITHDRAW)).toBeInTheDocument();
  });

  it('opens the modal when the button is clicked', async () => {
    render(
      <CartPopupModal
        type={CART_ITEM_TYPE_DEPOSIT}
        item={exampleItem}
        selector='All'
        open={true}
        setOpen={jest.fn()}
      />,
      { cartContext: mockDepositCartContext },
    );

    await userEvent.click(screen.getByText(CART_ITEM_TYPE_DEPOSIT));
    expect(screen.getByText(exampleItem.name)).toBeInTheDocument();
  });

  it('displays the correct item name', async () => {
    render(
      <CartPopupModal
        type={CART_ITEM_TYPE_DEPOSIT}
        item={exampleItem}
        selector='All'
        open={true}
        setOpen={jest.fn()}
      />,
      { cartContext: mockDepositCartContext },
    );
    await userEvent.click(screen.getByText(CART_ITEM_TYPE_DEPOSIT));
    expect(screen.getByText(exampleItem.name)).toBeInTheDocument();
  });

  it('displays the dropdown when there are multiple expiry dates', async () => {
    const mockItemWithDates = {
      ...exampleItem,
      expiry_dates: [
        { expiry_date: '2024-06-11', id: 1 },
        { expiry_date: '2024-06-12', id: 2 },
      ],
    };
    render(
      <CartPopupModal
        type={CART_ITEM_TYPE_DEPOSIT}
        item={mockItemWithDates}
        selector='All'
        open={true}
        setOpen={jest.fn()}
      />,
      { cartContext: mockDepositCartContext },
    );
    await userEvent.click(screen.getByText(CART_ITEM_TYPE_DEPOSIT));
    expect(
      screen.getByRole('button', {
        name: `Expiry Date ${mockItemWithDates.expiry_dates[0].expiry_date}`,
      }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Expiry Date'));
    expect(
      screen.getByDisplayValue(
        `${mockItemWithDates.expiry_dates[0].expiry_date}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', {
        name: `${mockItemWithDates.expiry_dates[1].expiry_date}`,
      }),
    ).toBeInTheDocument();
  });

  it('updates selectedExpiry when a date is clicked', async () => {
    const mockItemWithDates = {
      ...exampleItem,
      expiry_dates: [
        { expiry_date: '2024-06-11', id: 1 },
        { expiry_date: '2024-06-12', id: 2 },
      ],
    };
    render(
      <CartPopupModal
        type={CART_ITEM_TYPE_DEPOSIT}
        item={mockItemWithDates}
        selector='All'
        open={true}
        setOpen={jest.fn()}
      />,
      { cartContext: mockDepositCartContext },
    );
    await userEvent.click(screen.getByText(CART_ITEM_TYPE_DEPOSIT));
    await userEvent.click(
      screen.getByRole('button', {
        name: `Expiry Date ${mockItemWithDates.expiry_dates[0].expiry_date}`,
      }),
    );
    const expiryOption = screen.getByRole('option', {
      name: mockItemWithDates.expiry_dates[1].expiry_date,
    });
    await userEvent.click(expiryOption);
    expect(
      screen.getByRole('button', {
        name: `Expiry Date ${mockItemWithDates.expiry_dates[1].expiry_date}`,
      }),
    ).toBeInTheDocument();
  });

  it('display calendar when New is clicked and update selected date', async () => {
    const mockItemWithDates = {
      ...exampleItem,
      expiry_dates: [
        { expiry_date: '2023-06-11', id: 1 },
        { expiry_date: '2023-06-12', id: 2 },
      ],
    };
    render(
      <CartPopupModal
        type={CART_ITEM_TYPE_DEPOSIT}
        item={mockItemWithDates}
        selector='All'
        open={true}
        setOpen={jest.fn()}
      />,
      { cartContext: mockDepositCartContext },
    );
    await userEvent.click(screen.getByText(CART_ITEM_TYPE_DEPOSIT));
    await userEvent.click(
      screen.getByRole('button', {
        name: `Expiry Date ${mockItemWithDates.expiry_dates[0].expiry_date}`,
      }),
    );
    expect(screen.queryByText('Pick a new expiry date')).toBeNull();
    const addExpiryOption = screen.getByRole('option', { name: 'Add Expiry' });
    await userEvent.click(addExpiryOption);
    expect(
      await screen.findByText('Pick a new expiry date'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Ok',
      }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByText('Ok'));
    await waitForElementToBeRemoved(() =>
      screen.getByText('Pick a new expiry date'),
    );
    expect(screen.queryByText('Pick a new expiry date')).toBeNull();
    const date = dayjs().format('YYYY-MM-DD');
    expect(screen.queryByText(date)).toBeInTheDocument();
    const expirySelector = screen.getByRole('button', {
      name: `Expiry Date ${dayjs().format('YYYY-MM-DD')} (New)`,
    });
    expect(expirySelector).toBeInTheDocument();
  });

  it('renders the text fields with the correct labels', async () => {
    render(
      <CartPopupModal
        type={CART_ITEM_TYPE_DEPOSIT}
        item={exampleItem}
        selector='All'
        open={true}
        setOpen={jest.fn()}
      />,
      { cartContext: mockDepositCartContext },
    );
    await userEvent.click(screen.getByText(CART_ITEM_TYPE_DEPOSIT));
    expect(screen.getByText('Quantity')).toBeInTheDocument();
  });

  it('displays an error message when the field has negative numbers', async () => {
    const item = exampleItem;
    render(
      <CartPopupModal
        type={CART_ITEM_TYPE_DEPOSIT}
        item={item}
        selector='All'
        open={true}
        setOpen={jest.fn()}
      />,
      { cartContext: mockDepositCartContext },
    );

    await userEvent.click(screen.getByText(/Deposit/i));

    const qtyInput = screen.getByLabelText(/Quantity/i);

    await userEvent.clear(qtyInput);
    await userEvent.type(qtyInput, '-1');
    await userEvent.click(screen.getByRole('submit-button'));

    expect(
      screen.getByText(/Number must be greater than 0/i),
    ).toBeInTheDocument();
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
          expiryId: item.expiry_dates[0].id,
          type: CART_ITEM_TYPE_DEPOSIT,
          cartQuantity: 1,
        },
      ];

      render(
        <CartPopupModal
          type={CART_ITEM_TYPE_DEPOSIT}
          item={item}
          selector='All'
          open={true}
          setOpen={jest.fn()}
        />,
        { cartContext: mockDepositCartContext },
      );

      await userEvent.click(screen.getByText(/Deposit/i));

      const qtyInput = screen.getByLabelText('Quantity');
      await userEvent.clear(qtyInput);
      await userEvent.type(qtyInput, '1');

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
        <CartPopupModal
          type={CART_ITEM_TYPE_DEPOSIT}
          item={item}
          selector='All'
          open={true}
          setOpen={jest.fn()}
        />,
        { cartContext: mockDepositCartContext },
      );

      await userEvent.click(screen.getByText(/Deposit/i));

      const depositButton = screen.getByRole('submit-button');
      await userEvent.click(depositButton);

      expect(localStorage.setItem).not.toHaveBeenCalledWith(
        LOCAL_STORAGE_CART_KEY,
        JSON.stringify([...mockDepositCartContext.cartItems]),
      );
    });
  });
});
