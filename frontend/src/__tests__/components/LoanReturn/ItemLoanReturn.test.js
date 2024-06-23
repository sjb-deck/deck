import '@testing-library/jest-dom/extend-expect';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';

import { ItemLoanReturn } from '../../../components';
import { Api } from '../../../globals';
import { server } from '../../../mocks';
import { activeItemLoans, activeKitLoans } from '../../../mocks/loanActive';
import { render } from '../../../testSetup';
import { getUrlWithoutParams } from '../../../utils';

describe('Item Loan Return', () => {
  beforeEach(async () => {
    server.use(
      rest.get(getUrlWithoutParams(Api['kitHistory']), (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(activeKitLoans));
      }),
      rest.get(getUrlWithoutParams(Api['loan_active']), (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(activeItemLoans));
      }),
    );
    render(<ItemLoanReturn />);
    await waitFor(() => {
      expect(screen.getAllByText('test')[0]).toBeInTheDocument();
    });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it('should have correct headings', async () => {
    const headings = ['ID', 'Return Date', 'Loan Date', 'Loanee Name'];

    for (const heading of headings) {
      expect(screen.getAllByText(heading)[0]).toBeInTheDocument();
    }
  });

  it('should display loan information correctly', async () => {
    const details = ['125', '17 Nov 2023', '15 Nov 2023', 'test'];

    for (const detail of details) {
      expect(screen.getAllByText(detail)[0]).toBeInTheDocument();
    }

    const accordion = screen.getAllByTestId('details-125')[0];
    expect(accordion).not.toBeVisible();

    const kit = screen.getAllByText('125')[0];
    fireEvent.click(kit);

    expect(accordion).toBeVisible();

    const items = ['test expiry', '1'];

    for (const item of items) {
      expect(screen.getAllByText(item)[0]).toBeInTheDocument();
    }

    const actions = ['Return'];
    for (const action of actions) {
      expect(screen.getByRole('button', { name: action })).toBeInTheDocument();
    }
  });

  it('should filter by kit name', async () => {
    expect(screen.getByTestId('item-125')).toBeInTheDocument();
    expect(screen.getByTestId('item-96')).toBeInTheDocument();

    const searchInput = screen.getByLabelText('Search by');
    const selectInput = screen.getByTestId('item-select-name');
    expect(searchInput).toBeInTheDocument();
    expect(selectInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'somEthIn' } });

    expect(screen.getByTestId('item-96')).toBeInTheDocument();
    expect(screen.queryByTestId('item-125')).not.toBeInTheDocument();
  });

  it('should filter by loanee name', async () => {
    expect(screen.getByTestId('item-125')).toBeInTheDocument();
    expect(screen.getByTestId('item-96')).toBeInTheDocument();

    const searchInput = screen.getByLabelText('Search by');
    const selectInput = screen.getByTestId('item-select-name');
    expect(searchInput).toBeInTheDocument();
    expect(selectInput).toBeInTheDocument();

    fireEvent.change(selectInput, { target: { value: 'loanee' } });
    fireEvent.change(searchInput, { target: { value: 'wEeM' } });

    expect(screen.getByTestId('item-96')).toBeInTheDocument();
    expect(screen.queryByTestId('item-125')).not.toBeInTheDocument();
  });
});
