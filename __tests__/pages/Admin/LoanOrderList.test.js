import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import AdminIndex from '../../../pages/inventory/adminIndex';
import { render } from '../../../testSetup';
describe('AdminIndex LoanOrder List', () => {
  it('should display loans list on toggle', async () => {
    render(<AdminIndex />);
    await waitFor(() =>
      expect(screen.getAllByText('Withdraw')[0]).toBeInTheDocument(),
    );

    const orderButton = screen.getByRole('button', {
      name: 'Orders',
    });
    const loanOrderButton = screen.getByRole('button', {
      name: 'Loans',
    });

    expect(orderButton).toBeInTheDocument();
    expect(loanOrderButton).toBeInTheDocument();

    fireEvent.click(loanOrderButton);
    expect(orderButton).not.toHaveStyle('color: rgb(255, 255, 255)');
    expect(loanOrderButton).toHaveStyle('color: rgb(255, 255, 255)');

    const orderIds = [103, 104, 105];

    for (const id of orderIds) {
      const order = screen.getAllByTestId(`order-${id}`)[0];
      expect(order).toBeInTheDocument();
    }
  });

  it('should expand loan order accordion onclick', async () => {
    render(<AdminIndex />);
    await waitFor(() => {
      expect(screen.getAllByText('Withdraw')[0]).toBeInTheDocument();
    });
    const loanOrderButton = screen.getByRole('button', {
      name: 'Loans',
    });
    fireEvent.click(loanOrderButton);

    const accordion = screen.getAllByTestId('details-104')[0];
    expect(accordion).not.toBeVisible();

    const order = screen.getAllByText('104')[0];
    fireEvent.click(order);

    expect(accordion).toBeVisible();

    const orderDetails = [
      'Loan Status:',
      'Returned',
      'Loanee Name:',
      'another one',
      'Other info:',
      '-',
      'No. of items',
      '1',
      'Return Date:',
      '23 Aug 2023',
      'test expiry',
      '3',
    ];
    for (const detail of orderDetails) {
      const info = within(accordion).getAllByText(detail)[0];
      expect(info).toBeInTheDocument();
    }

    const revertButton = within(accordion).getByRole('button', {
      name: 'Revert Loan',
    });
    expect(revertButton).toBeInTheDocument();
  });

  it('loan order pagination', async () => {
    render(<AdminIndex />);
    await waitFor(() => {
      expect(screen.getAllByText('Withdraw')[0]).toBeInTheDocument();
    });
    const loanOrderButton = screen.getByRole('button', {
      name: 'Loans',
    });
    fireEvent.click(loanOrderButton);

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

    const firstPageOrdersId = [103, 104, 105];
    const secondPageOrdersId = [127, 128, 129];

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

  it('loan order search filter works', async () => {
    render(<AdminIndex />);
    await waitFor(() => {
      expect(screen.getAllByText('Withdraw')[0]).toBeInTheDocument();
    });
    const loanOrderButton = screen.getByRole('button', {
      name: 'Loans',
    });
    fireEvent.click(loanOrderButton);

    const searchInput = screen.getByLabelText('Search');
    const selectInput = screen.getByTestId('search-select');

    expect(searchInput).toBeInTheDocument();
    expect(selectInput).toBeInTheDocument();
    expect(selectInput).toHaveValue('item');

    // filter by item name
    fireEvent.change(searchInput, { target: { value: 'tEst ex' } });

    expect(screen.getByTestId('order-104')).toBeInTheDocument();
    expect(screen.queryByTestId('order-103')).not.toBeInTheDocument();
    expect(screen.queryByTestId('order-105')).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'soMe' } });

    expect(screen.getByTestId('order-105')).toBeInTheDocument();
    expect(screen.queryByTestId('order-103')).not.toBeInTheDocument();
    expect(screen.queryByTestId('order-104')).not.toBeInTheDocument();

    // filter by user
    fireEvent.change(selectInput, { target: { value: 'user' } });
    fireEvent.change(searchInput, { target: { value: 'sIw' } });

    expect(screen.getByTestId('order-103')).toBeInTheDocument();
    expect(screen.queryByTestId('order-104')).not.toBeInTheDocument();
    expect(screen.queryByTestId('order-105')).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'joN' } });

    expect(screen.getByTestId('order-104')).toBeInTheDocument();
    expect(screen.queryByTestId('order-105')).toBeInTheDocument();
    expect(screen.queryByTestId('order-103')).not.toBeInTheDocument();

    // filter by loanee
    fireEvent.change(selectInput, { target: { value: 'loanee' } });
    fireEvent.change(searchInput, { target: { value: 'hElLo' } });

    expect(screen.getByTestId('order-103')).toBeInTheDocument();
    expect(screen.queryByTestId('order-104')).not.toBeInTheDocument();
    expect(screen.queryByTestId('order-105')).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'bYe' } });

    expect(screen.getByTestId('order-105')).toBeInTheDocument();
    expect(screen.queryByTestId('order-103')).not.toBeInTheDocument();
    expect(screen.queryByTestId('order-104')).not.toBeInTheDocument();
  });
});
