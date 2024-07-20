import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';

import { KitHistoryAccordion } from '../../../components/KitInfo/KitHistoryAccordion';
import { Api } from '../../../globals/api';
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
      http.get(
        buildUrl(Api['kitRecipe'], { id: exampleKit.blueprint_id }),
        () => {
          return HttpResponse.json(exampleKitRecipe, { status: 200 });
        },
      ),
    ),
  );

  it('calls API correctly when page is changed', async () => {
    let lastRequest = null;
    server.use(
      http.get(getUrlWithoutParams(Api['kitHistory']), ({ request }) => {
        lastRequest = request;
        return HttpResponse.json(extendedExampleKitHistory, { status: 200 });
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
    expect(parseInt(new URL(lastRequest.url).searchParams.get('kitId'))).toBe(
      exampleKit.id,
    );
    expect(new URL(lastRequest.url).searchParams.get('page')).toBe('2');
  });
});
