import { render, screen } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import Receipt from '../../../components/Admin/Receipt';

describe('Receipt', () => {
  const orderDetails = {
    id: 97,
    user: {
      username: 'demo',
      email: '',
      extras: {
        profile_pic: null,
        role: 'Admin',
        name: 'demo',
      },
    },
    order_items: [
      {
        id: 96,
        item_expiry: {
          id: 41,
          expiry_date: null,
          quantity: 56,
          archived: false,
        },
        ordered_quantity: 5,
        returned_quantity: null,
      },
      {
        id: 97,
        item_expiry: {
          id: 42,
          expiry_date: '2023-07-13',
          quantity: 32,
          archived: false,
        },
        ordered_quantity: 3,
        returned_quantity: null,
      },
    ],
    stipulated_return_date: '2023-08-23T00:00:00Z',
    loanee_name: 'Joh',
    loan_active: true,
    action: 'Withdraw',
    reason: 'loan',
    date: '2023-07-23T07:05:26.400738Z',
  };

  test('should render the component with the correct data', () => {
    render(<Receipt orderData={orderDetails}></Receipt>);

    // Assert that the receipt subheader is displayed and order items like the id and quantity are displayed
    expect(screen.getByText('Order 97 Confirmed!')).toBeInTheDocument();
    expect(
      screen.getByText('View your order details below:'),
    ).toBeInTheDocument();
    expect(screen.getByText('Id')).toBeInTheDocument();
    expect(screen.getByText('Expiry Date')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getByText('96')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('97')).toBeInTheDocument();
    expect(screen.getByText('2023-07-13')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
