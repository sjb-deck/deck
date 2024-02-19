import { screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';

import { Api } from '../../../globals';
import { exampleKit, exampleKitRecipe, server } from '../../../mocks';
import { KitLoanReturn } from '../../../pages/kitLoanReturn';
import { render } from '../../../testSetup';
import { getUrlWithoutParams } from '../../../utils';

describe('<KitLoanReturn />', () => {
  beforeEach(() => {
    server.use(
      rest.get(getUrlWithoutParams(Api['kitRecipe']), (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(exampleKitRecipe));
      }),
      rest.get(getUrlWithoutParams(Api['kit']), (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(exampleKit));
      }),
    );
    jest.spyOn(URLSearchParams.prototype, 'get').mockImplementation((key) => {
      return exampleKit.id;
    });
  });
  it('renders the page', async () => {
    render(<KitLoanReturn />);

    await waitFor(() => {
      expect(screen.getByText(exampleKit.name)).toBeInTheDocument();
    });
  });

  it('renders error message when kit is not loaned out', () => {
    server.use(
      rest.get(getUrlWithoutParams(Api['kit']), (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ ...exampleKit, status: 'Available' }),
        );
      }),
    );
    render(<KitLoanReturn />);
    // TODO: Update error message to actual
    expect(screen.getByText('Kit is not loaned out')).toBeInTheDocument();
  });

  it('renders error message when query params are not found', () => {
    jest.spyOn(URLSearchParams.prototype, 'get').mockImplementation((key) => {
      return null;
    });
    render(<KitLoanReturn />);
    // TODO: Update error message to actual
    expect(screen.getByText('Kit not found')).toBeInTheDocument();
  });
});
