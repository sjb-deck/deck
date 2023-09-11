import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import AdminIndex from '../../../pages/inventory/adminIndex';
import { render } from '../../../testSetup';

describe('AdminIndex Order List', () => {
  it('should display order list by default', async () => {
    render(<AdminIndex />);
    await waitFor(() => {
      expect(screen.getAllByText('Withdraw')[0]).toBeInTheDocument();
    });

    const orderButton = screen.getByRole('button', {
      name: 'Orders',
    });
    const loanOrderButton = screen.getByRole('button', {
      name: 'Loans',
    });

    expect(orderButton).toBeInTheDocument();
    expect(orderButton).toHaveStyle('color: rgb(255, 255, 255)');
    expect(loanOrderButton).toBeInTheDocument();
    expect(loanOrderButton).not.toHaveStyle('color: rgb(255, 255, 255)');

    const orderIds = [100, 101, 102];

    for (const id of orderIds) {
      const order = screen.getAllByTestId(`order-${id}`)[0];
      expect(order).toBeInTheDocument();
    }
  });

  it('should expand order accordion onclick', async () => {
    render(<AdminIndex />);
    await waitFor(() => {
      expect(screen.getAllByText('Withdraw')[0]).toBeInTheDocument();
    });

    const accordion = screen.getAllByTestId('details-100')[0];
    expect(accordion).not.toBeVisible();

    const order = screen.getAllByText('100')[0];
    fireEvent.click(order);

    expect(accordion).toBeVisible();

    const orderDetails = [
      'Other info:',
      'test2',
      'Reason:',
      'Others',
      'No. of items',
      '0',
    ];
    for (const detail of orderDetails) {
      const info = within(accordion).getByText(detail);
      expect(info).toBeInTheDocument();
    }

    const revertButton = within(accordion).getByRole('button', {
      name: 'Revert Order',
    });
    expect(revertButton).toBeInTheDocument();
  });

  it('order pagination should work', async () => {
    render(<AdminIndex />);
    await waitFor(() => {
      expect(screen.getAllByText('Withdraw')[0]).toBeInTheDocument();
    });

    const pageTwoButton = screen.getByRole('button', { name: 'Go to page 2' });
    const previousPageButton = screen.getByRole('button', {
      name: 'Go to previous page',
    });
    const nextPageButton = screen.getByRole('button', {
      name: 'Go to previous page',
    });

    expect(pageTwoButton).toBeInTheDocument();
    expect(previousPageButton).toBeInTheDocument();
    expect(nextPageButton).toBeInTheDocument();

    const firstPageOrdersId = [100, 101, 102];
    const secondPageOrdersId = [124, 125, 126];

    for (const id of firstPageOrdersId) {
      const order = screen.getAllByTestId(`order-${id}`)[0];
      expect(order).toBeInTheDocument();
    }

    for (const id of secondPageOrdersId) {
      const order = screen.queryByTestId(`order-${id}`);
      expect(order).not.toBeInTheDocument();
    }

    fireEvent.click(pageTwoButton);

    for (const id of firstPageOrdersId) {
      const order = screen.queryByTestId(`order-${id}`);
      expect(order).not.toBeInTheDocument();
    }

    for (const id of secondPageOrdersId) {
      const order = screen.getAllByTestId(`order-${id}`)[0];
      expect(order).toBeInTheDocument();
    }
  });

  it('order search filter works', async () => {
    render(<AdminIndex />);
    await waitFor(() => {
      expect(screen.getAllByText('Withdraw')[0]).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText('Search');
    const selectInput = screen.getByTestId('search-select');

    expect(searchInput).toBeInTheDocument();
    expect(selectInput).toBeInTheDocument();
    expect(selectInput).toHaveValue('item');

    // filter by item name
    fireEvent.change(searchInput, { target: { value: 'tEst ex' } });

    expect(screen.getByTestId('order-101')).toBeInTheDocument();
    expect(screen.queryByTestId('order-100')).not.toBeInTheDocument();
    expect(screen.queryByTestId('order-102')).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'rAnd' } });

    expect(screen.getByTestId('order-102')).toBeInTheDocument();
    expect(screen.queryByTestId('order-100')).not.toBeInTheDocument();
    expect(screen.queryByTestId('order-101')).not.toBeInTheDocument();

    // filter by user
    fireEvent.change(selectInput, { target: { value: 'user' } });
    fireEvent.change(searchInput, { target: { value: 'sIw' } });

    expect(screen.getByTestId('order-100')).toBeInTheDocument();
    expect(screen.queryByTestId('order-101')).not.toBeInTheDocument();
    expect(screen.queryByTestId('order-102')).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'jOn' } });

    expect(screen.getByTestId('order-101')).toBeInTheDocument();
    expect(screen.getByTestId('order-102')).toBeInTheDocument();
    expect(screen.queryByTestId('order-100')).not.toBeInTheDocument();
  });
});
