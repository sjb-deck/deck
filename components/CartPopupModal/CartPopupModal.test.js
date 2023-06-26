import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import '@testing-library/jest-dom';
import CartPopupModal from './CartPopupModal';

describe('CartPopupModal', () => {
  const mockItem = {
    name: 'Test Item',
    expirydates: [],
    imgpic: '',
    unit: 'pieces',
  };

  it('renders without crashing', () => {
    render(<CartPopupModal type='Deposit' item={mockItem} selector='All' />);
  });

  it('displays the Deposit button when type is Deposit', () => {
    render(<CartPopupModal type='Deposit' item={mockItem} selector='All' />);
    expect(screen.getByText('Deposit')).toBeInTheDocument();
  });

  it('displays the Withdraw button when type is Withdraw', () => {
    render(<CartPopupModal type='Withdraw' item={mockItem} selector='All' />);
    expect(screen.getByText('Withdraw')).toBeInTheDocument();
  });

  it('opens the modal when the button is clicked', () => {
    render(<CartPopupModal type='Deposit' item={mockItem} selector='All' />);
    fireEvent.click(screen.getByText('Deposit'));
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('displays the correct item name', () => {
    render(<CartPopupModal type='Deposit' item={mockItem} selector='All' />);
    fireEvent.click(screen.getByText('Deposit'));
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
      <CartPopupModal type='Deposit' item={mockItemWithDates} selector='All' />,
    );
    fireEvent.click(screen.getByText('Deposit'));
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
      <CartPopupModal type='Deposit' item={mockItemWithDates} selector='All' />,
    );
    await userEvent.click(screen.getByText('Deposit'));
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
    render(<CartPopupModal type='Deposit' item={mockItem} selector='All' />);
    await userEvent.click(screen.getByText('Deposit'));
    expect(screen.getByText('Opened Qty')).toBeInTheDocument();
    expect(screen.getByText('Unopened Qty')).toBeInTheDocument();
  });
});
