import '@testing-library/jest-dom/extend-expect';
import { act, screen, waitFor, within } from '@testing-library/react';
import React from 'react';

import { KitCartContent } from '../../../components/KitCart/KitCartContent';
import { LOCAL_STORAGE_KIT_CART_KEY } from '../../../globals';
import { KitIndex } from '../../../pages';
import { render, userEvent } from '../../../testSetup';
describe('Kit List', () => {
  beforeEach(() => {
    setItemSpy = jest.fn();
    global.localStorage.__proto__.setItem = setItemSpy;
    global.localStorage.__proto__.getItem = jest.fn((key) =>
      key === LOCAL_STORAGE_KIT_CART_KEY
        ? JSON.stringify([
            {
              id: 35,
              blueprint_name: 'Mock Blueprint',
              name: 'Mock Kit',
              complete: 'complete',
            },
          ])
        : null,
    );
  });

  afterEach(() => {
    setItemSpy.mockClear();
    global.localStorage.__proto__.setItem.mockClear();
    global.localStorage.__proto__.getItem.mockClear();
  });
  it('should display and withdraw kits correctly', async () => {
    act(() => {
      render(<KitIndex />);
    });
    await waitFor(() => {
      expect(screen.getAllByText('Ready')[0]).toBeInTheDocument();
    });

    const accordion = screen.getAllByTestId('details-31')[0];
    const kit = screen.getAllByText('31')[0];
    await userEvent.click(kit);

    expect(accordion).toBeVisible();
    const withdrawButton = within(accordion).getAllByText('Withdraw')[0];
    await userEvent.click(withdrawButton);

    expect(withdrawButton).toBeDisabled();
  });

  it('should display kit list correctly', async () => {
    act(() => {
      render(<KitCartContent />);
    });
    await waitFor(() => {
      expect(screen.getAllByText('Mock Kit')[0]).toBeInTheDocument();
    });

    const details = ['complete', 'Mock Kit', 'Blueprint: Mock Blueprint'];

    for (const detail of details) {
      expect(screen.getAllByText(detail)[0]).toBeInTheDocument();
    }
  });

  it('should remove kit from cart', async () => {
    act(() => {
      render(<KitCartContent />);
    });
    await waitFor(() => {
      expect(screen.getAllByText('Mock Kit')[0]).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId('35-delete-btn');
    expect(deleteButton).toBeInTheDocument();

    const details = screen.getAllByText('Mock Kit')[0];
    expect(details).toBeInTheDocument();

    await userEvent.click(deleteButton);

    const noItems =
      'The cart is empty, deposit/withdraw items and it will appear here';

    expect(details).not.toBeInTheDocument();
    expect(screen.getAllByText(noItems)[0]).toBeInTheDocument();
  });

  it('should show error message when required fields are unfilled', async () => {
    act(() => {
      render(<KitCartContent />);
    });
    await waitFor(() => {
      expect(screen.getAllByText('Mock Kit')[0]).toBeInTheDocument();
    });

    // I think the HTML date input automatically restricts the date from the attributes set. Unable to force a past date or set it to empty
    // const dateInput = screen.getByLabelText('Return Date');
    // await userEvent.type(dateInput, '2022-01-01');

    await userEvent.click(screen.getByRole('submit-button'));

    await waitFor(() => {
      expect(
        screen.getAllByText('Loanee name is required')[0],
      ).toBeInTheDocument();
    });
  });

  it('should submit kit loan correctly', async () => {
    act(() => {
      render(<KitCartContent />);
    });
    await waitFor(() => {
      expect(screen.getAllByText('Mock Kit')[0]).toBeInTheDocument();
    });

    const details = screen.getAllByText('Mock Kit')[0];
    const noItems =
      'The cart is empty, deposit/withdraw items and it will appear here';

    const loaneeInput = screen.getByLabelText('Loanee Name');
    await userEvent.type(loaneeInput, 'Hi');

    await userEvent.click(screen.getByRole('submit-button'));

    await waitFor(() => {
      expect(
        screen.getAllByText('Successfully withdrew kit(s)!')[0],
      ).toBeInTheDocument();
      expect(details).not.toBeInTheDocument();
      expect(screen.getAllByText(noItems)[0]).toBeInTheDocument();
    });
  });
});
