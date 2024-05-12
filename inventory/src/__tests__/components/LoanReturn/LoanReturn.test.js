import '@testing-library/jest-dom/extend-expect';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';

import { Api } from '../../../globals';
import { server } from '../../../mocks';
import { activeItemLoans, activeKitLoans } from '../../../mocks/loanActive';
import { LoanReturn } from '../../../pages';
import { render } from '../../../testSetup';
import { getUrlWithoutParams } from '../../../utils';

describe('Loan Return', () => {
  beforeAll(() => {
    server.use(
      rest.get(getUrlWithoutParams(Api['kitHistory']), (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(activeKitLoans));
      }),
      rest.get(getUrlWithoutParams(Api['loan_active']), (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(activeItemLoans));
      }),
    );
  });

  afterAll(() => {
    server.resetHandlers();
  });

  it('should switch between item/kit loan view', async () => {
    act(() => {
      render(<LoanReturn />);
    });
    await waitFor(() => {
      expect(screen.getAllByText('test')[0]).toBeInTheDocument();
    });

    const kitBtn = screen.getByRole('button', { name: 'Kits' });
    const itemBtn = screen.getByRole('button', { name: 'Items' });
    expect(kitBtn).toBeInTheDocument();
    expect(itemBtn).toBeInTheDocument();

    fireEvent.click(kitBtn);

    await waitFor(() => {
      expect(screen.getAllByText('tester')[0]).toBeInTheDocument();
    });

    fireEvent.click(itemBtn);

    await waitFor(() => {
      expect(screen.getAllByText('test')[0]).toBeInTheDocument();
    });
  });
});
