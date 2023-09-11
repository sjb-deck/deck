import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';

import { Receipt } from '../../../components';
import { INV_API_ORDER_URL, ORDER_REASONS } from '../../../globals';
import {
  mockDepositOrder,
  mockLoanOrder,
  mockWithdrawOrder,
} from '../../../mocks';
import { server } from '../../../mocks/server';
import { render } from '../../../testSetup';

describe('Receipt', () => {
  it('should render the component with the correct data when it is a withdraw order', async () => {
    server.use(
      rest.get(
        INV_API_ORDER_URL.replace(':id', mockWithdrawOrder.id),
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              ...mockWithdrawOrder,
            }),
          );
        },
      ),
    );
    render(<Receipt orderId={mockWithdrawOrder.id}></Receipt>);

    await waitForElementToBeRemoved(() =>
      screen.getByTestId('loading-spinner'),
    );

    // Assert that the receipt subheader is displayed and order items like the id and quantity are displayed
    expect(
      screen.getByText(`Order ${mockWithdrawOrder.id} Confirmed!`),
    ).toBeInTheDocument();
    expect(
      screen.getByText('View your order details below:'),
    ).toBeInTheDocument();

    // check order details
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Reason')).toBeInTheDocument();
    expect(screen.getByText('Date Ordered')).toBeInTheDocument();
    expect(
      screen.getByText(mockWithdrawOrder.user.extras.name),
    ).toBeInTheDocument();
    expect(screen.getByText(mockWithdrawOrder.action)).toBeInTheDocument();
    expect(
      screen.getByText(ORDER_REASONS[mockWithdrawOrder.reason]),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new Date(mockWithdrawOrder.date).toLocaleString()),
    ).toBeInTheDocument();
  });

  it('should render the component with the correct data when it is a deposit order', async () => {
    server.use(
      rest.get(
        INV_API_ORDER_URL.replace(':id', mockDepositOrder.id),
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              ...mockDepositOrder,
            }),
          );
        },
      ),
    );
    render(<Receipt orderId={mockDepositOrder.id}></Receipt>);

    await waitForElementToBeRemoved(() =>
      screen.getByTestId('loading-spinner'),
    );

    // Assert that the receipt subheader is displayed and order items like the id and quantity are displayed
    expect(
      screen.getByText(`Order ${mockDepositOrder.id} Confirmed!`),
    ).toBeInTheDocument();
    expect(
      screen.getByText('View your order details below:'),
    ).toBeInTheDocument();

    // check order details
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Reason')).toBeInTheDocument();
    expect(screen.getByText('Date Ordered')).toBeInTheDocument();
    expect(
      screen.getByText(mockDepositOrder.user.extras.name),
    ).toBeInTheDocument();
    expect(screen.getByText(mockDepositOrder.action)).toBeInTheDocument();
    expect(
      screen.getByText(ORDER_REASONS[mockDepositOrder.reason]),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new Date(mockDepositOrder.date).toLocaleString()),
    ).toBeInTheDocument();
  });

  it('should render the component with the correct data when it is a loan order', async () => {
    server.use(
      rest.get(
        INV_API_ORDER_URL.replace(':id', mockLoanOrder.id),
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              ...mockLoanOrder,
            }),
          );
        },
      ),
    );
    render(<Receipt orderId={mockLoanOrder.id}></Receipt>);

    await waitForElementToBeRemoved(() =>
      screen.getByTestId('loading-spinner'),
    );

    // Assert that the receipt subheader is displayed and order items like the id and quantity are displayed
    expect(
      screen.getByText(`Order ${mockLoanOrder.id} Confirmed!`),
    ).toBeInTheDocument();
    expect(
      screen.getByText('View your order details below:'),
    ).toBeInTheDocument();

    // check order details
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Loanee Name')).toBeInTheDocument();
    expect(screen.getByText('Due Date')).toBeInTheDocument();
    expect(screen.getByText('Return Date')).toBeInTheDocument();
    expect(screen.getByText('Loan Status')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Reason')).toBeInTheDocument();
    expect(screen.getByText('Date Ordered')).toBeInTheDocument();
    expect(
      screen.getByText(mockLoanOrder.user.extras.name),
    ).toBeInTheDocument();
    expect(screen.getByText(mockLoanOrder.action)).toBeInTheDocument();
    expect(
      screen.getByText(ORDER_REASONS[mockLoanOrder.reason]),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new Date(mockLoanOrder.date).toLocaleString()),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockLoanOrder.loan_active ? 'Active' : 'Inactive'),
    ).toBeInTheDocument();
    expect(screen.getByText(mockLoanOrder.loanee_name)).toBeInTheDocument();
    expect(
      screen.getByText(new Date(mockLoanOrder.due_date).toLocaleString()),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new Date(mockLoanOrder.return_date).toLocaleString()),
    ).toBeInTheDocument();
  });
});
