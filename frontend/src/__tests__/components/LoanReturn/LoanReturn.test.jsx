import { fireEvent, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { Api } from '../../../globals/api';
import { server } from '../../../mocks';
import { activeItemLoans, activeKitLoans } from '../../../mocks/loanActive';
import { LoanReturn } from '../../../pages';
import { render } from '../../../testSetup';
import { getUrlWithoutParams } from '../../../utils';

describe('Loan Return', () => {
  beforeAll(() => {
    server.use(
      http.get(getUrlWithoutParams(Api['kitHistory']), () => {
        return HttpResponse.json(activeKitLoans, { status: 200 });
      }),
      http.get(getUrlWithoutParams(Api['loan_active']), () => {
        return HttpResponse.json(activeItemLoans, { status: 200 });
      }),
    );
  });

  afterAll(() => {
    server.resetHandlers();
  });

  it('should switch between item/kit loan view', async () => {
    render(<LoanReturn />);
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
  }, 10000);
});
