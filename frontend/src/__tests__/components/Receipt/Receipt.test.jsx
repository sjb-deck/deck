import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { Receipt } from '../../../components';
import { Api } from '../../../globals/api';
import { ORDER_REASONS } from '../../../globals/constants';
import {
  mockDepositOrder,
  mockLoanOrder,
  mockWithdrawOrder,
} from '../../../mocks';
import { server } from '../../../mocks/server';
import { render } from '../../../testSetup';
import { getUrlWithoutParams } from '../../../utils';

describe('Receipt', () => {
  it('should render the component with the correct data when it is a withdraw order', async () => {
    server.use(
      http.get(getUrlWithoutParams(Api['order']), () => {
        return HttpResponse.json(
          {
            results: [{ ...mockWithdrawOrder }],
          },
          { status: 200 },
        );
      }),
    );
    render(<Receipt orderId={mockWithdrawOrder.id} />);

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

    // check order items
    for (const orderItem of mockWithdrawOrder.order_items) {
      expect(
        screen.getByText(orderItem.item_expiry.expiry_date ?? 'No Expiry'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(orderItem.item_expiry.item.name),
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Ordered Quantity: ${orderItem.ordered_quantity}`),
      ).toBeInTheDocument();
    }
  });

  it('should render the component with the correct data when it is a deposit order', async () => {
    server.use(
      http.get(getUrlWithoutParams(Api['order']), () => {
        return HttpResponse.json(
          {
            results: [{ ...mockDepositOrder }],
          },
          { status: 200 },
        );
      }),
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

    // check order items
    for (const orderItem of mockDepositOrder.order_items) {
      expect(
        screen.getByText(orderItem.item_expiry.expiry_date ?? 'No Expiry'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(orderItem.item_expiry.item.name),
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Ordered Quantity: ${orderItem.ordered_quantity}`),
      ).toBeInTheDocument();
    }
  });

  it('should render the component with the correct data when it is a loan order', async () => {
    server.use(
      http.get(getUrlWithoutParams(Api['order']), () => {
        return HttpResponse.json(
          {
            results: [{ ...mockLoanOrder }],
          },
          { status: 200 },
        );
      }),
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
    expect(screen.getByText(mockLoanOrder.loanee_name)).toBeInTheDocument();
    expect(
      screen.getByText(new Date(mockLoanOrder.due_date).toDateString()),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new Date(mockLoanOrder.return_date).toLocaleString()),
    ).toBeInTheDocument();

    // check order items
    for (const orderItem of mockLoanOrder.order_items) {
      expect(
        screen.getByText(orderItem.item_expiry.expiry_date ?? 'No Expiry'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(orderItem.item_expiry.item.name),
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Ordered Quantity: ${orderItem.ordered_quantity}`),
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Returned Quantity: ${orderItem.returned_quantity}`),
      ).toBeInTheDocument();
    }
  });

  it.todo(
    'should render the component with correct data when order is reverted, and alert the user',
  );
});
