import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';

import { KitHistoryAccordion } from '../../../components/KitInfo/KitHistoryAccordion';
import { Api } from '../../../globals';
import {
  exampleKit,
  exampleKitRecipe,
  extendedExampleKitHistory,
  server,
} from '../../../mocks';
import { render, userEvent } from '../../../testSetup';
import { buildUrl, getUrlWithoutParams } from '../../../utils';

describe('<KitHistoryAccordion />', () => {
  beforeEach(() =>
    server.use(
      rest.get(
        buildUrl(Api['kitRecipe'], { id: exampleKit.blueprint_id }),
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(exampleKitRecipe));
        },
      ),
    ),
  );

  it('calls API correctly when page is changed', async () => {
    let lastRequest = null;
    server.use(
      rest.get(getUrlWithoutParams(Api['kitHistory']), (req, res, ctx) => {
        lastRequest = req;
        return res(ctx.status(200), ctx.json(extendedExampleKitHistory));
      }),
    );
    render(<KitHistoryAccordion kitId={exampleKit.id} />);

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-spinner'),
    );

    expect(screen.getByText('Kit History')).toBeInTheDocument();

    // check that pagination is rendered
    expect(screen.getByLabelText('pagination navigation')).toBeInTheDocument();

    // change page
    await userEvent.click(screen.getByLabelText('Go to next page'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-spinner'),
    );

    // check that API is called correctly
    expect(parseInt(lastRequest.url.searchParams.get('kitId'))).toBe(
      exampleKit.id,
    );
    expect(lastRequest.url.searchParams.get('page')).toBe('2');
  });
});
