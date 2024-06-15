import '@testing-library/jest-dom/extend-expect';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';

import { KitReturn } from '../../../components/LoanReturn/kit/KitReturn';
import { Api } from '../../../globals';
import { server } from '../../../mocks';
import { activeItemLoans, activeKitLoans } from '../../../mocks/loanActive';
import { render } from '../../../testSetup';
import { getUrlWithoutParams } from '../../../utils';

describe('Kit Loan Return', () => {
  beforeEach(async () => {
    server.use(
      rest.get(getUrlWithoutParams(Api['kitHistory']), (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(activeKitLoans));
      }),
      rest.get(getUrlWithoutParams(Api['loan_active']), (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(activeItemLoans));
      }),
    );
    render(<KitReturn />);
    await waitFor(() => {
      expect(screen.getAllByText('tester')[0]).toBeInTheDocument();
    });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it('should have correct headings', async () => {
    const headings = ['ID', 'Name', 'Loanee Name', 'Due Date'];

    for (const heading of headings) {
      expect(screen.getAllByText(heading)[0]).toBeInTheDocument();
    }
  });

  it('should display loan information correctly', async () => {
    const details = ['107', 'Test Kit', 'tester', '30 Dec 2024'];

    for (const detail of details) {
      expect(screen.getAllByText(detail)[0]).toBeInTheDocument();
    }

    const accordion = screen.getAllByTestId('details-107')[0];
    expect(accordion).not.toBeVisible();

    const kit = screen.getAllByText('107')[0];
    fireEvent.click(kit);

    expect(accordion).toBeVisible();

    const items = ['test expiry', '4', 'something new1', '2'];

    for (const item of items) {
      expect(screen.getAllByText(item)[0]).toBeInTheDocument();
    }

    const actions = ['View Kit', 'Return', 'Restock'];
    for (const action of actions) {
      expect(screen.getByRole('button', { name: action })).toBeInTheDocument();
    }
  });

  it('should filter by kit name', async () => {
    expect(screen.getByTestId('kit-107')).toBeInTheDocument();
    expect(screen.getByTestId('kit-99')).toBeInTheDocument();

    const searchInput = screen.getByLabelText('Search by');
    const selectInput = screen.getByTestId('kit-select-name');
    expect(searchInput).toBeInTheDocument();
    expect(selectInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'tEs' } });

    expect(screen.getByTestId('kit-107')).toBeInTheDocument();
    expect(screen.queryByTestId('kit-99')).not.toBeInTheDocument();
  });

  it('should filter by loanee name', async () => {
    expect(screen.getByTestId('kit-107')).toBeInTheDocument();
    expect(screen.getByTestId('kit-99')).toBeInTheDocument();

    const searchInput = screen.getByLabelText('Search by');
    const selectInput = screen.getByTestId('kit-select-name');
    expect(searchInput).toBeInTheDocument();
    expect(selectInput).toBeInTheDocument();

    fireEvent.change(selectInput, { target: { value: 'loanee' } });
    fireEvent.change(searchInput, { target: { value: 'fs' } });

    expect(screen.getByTestId('kit-99')).toBeInTheDocument();
    expect(screen.queryByTestId('kit-107')).not.toBeInTheDocument();
  });
});
