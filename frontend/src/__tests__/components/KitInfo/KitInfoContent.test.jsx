import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';

import { KitInfoContent } from '../../../components';
import { Api } from '../../../globals/api';
import {
  exampleKit,
  exampleKitHistory,
  exampleKitRecipe,
  server,
} from '../../../mocks';
import { render } from '../../../testSetup';
import { buildUrl, getUrlWithoutParams } from '../../../utils';

describe('<KitInfoContent />', () => {
  beforeEach(() =>
    server.use(
      http.get(getUrlWithoutParams(Api['kitHistory']), () => {
        return HttpResponse.json(exampleKitHistory, { status: 200 });
      }),
      http.get(
        buildUrl(Api['kitRecipe'], { id: exampleKit.blueprint_id }),
        () => {
          return HttpResponse.json(exampleKitRecipe, { status: 200 });
        },
      ),
    ),
  );
  it('renders a loaned and incomplete kit correctly', () => {
    render(<KitInfoContent kitData={exampleKit} />);

    expect(screen.getByText('Test Kit')).toBeInTheDocument();
    expect(screen.getByText('Test Blueprint')).toBeInTheDocument();
    expect(screen.getByText(/LOANED, INCOMPLETE/i)).toBeInTheDocument();

    // check that the correct buttons are rendered
    expect(screen.getByText('Return')).toBeInTheDocument();
    expect(screen.queryByText('Withdraw')).not.toBeInTheDocument();
    expect(screen.queryByText('Restock')).not.toBeInTheDocument();

    // check that the kit contents accordion is rendered
    expect(screen.getByText('Kit Contents')).toBeInTheDocument();

    // check that the kit history accordion is rendered
    expect(screen.getByText('Kit History')).toBeInTheDocument();
  });

  it('renders a ready and incomplete kit correctly', () => {
    render(
      <KitInfoContent
        kitData={{
          ...exampleKit,
          status: 'READY',
        }}
      />,
    );

    expect(screen.getByText('Test Kit')).toBeInTheDocument();
    expect(screen.getByText('Test Blueprint')).toBeInTheDocument();
    expect(screen.getByText(/READY, INCOMPLETE/i)).toBeInTheDocument();

    // check that the correct buttons are rendered
    expect(screen.getByText('Withdraw')).toBeInTheDocument();
    expect(screen.queryByText('Return')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Restock' })).toBeInTheDocument();

    // check that the kit contents accordion is rendered
    expect(screen.getByText('Kit Contents')).toBeInTheDocument();

    // check that the kit history accordion is rendered
    expect(screen.getByText('Kit History')).toBeInTheDocument();
  });

  it('renders a ready and complete kit correctly', () => {
    render(
      <KitInfoContent
        kitData={{
          ...exampleKit,
          status: 'READY',
          complete: 'complete',
        }}
      />,
    );

    expect(screen.getByText('Test Kit')).toBeInTheDocument();
    expect(screen.getByText('Test Blueprint')).toBeInTheDocument();
    expect(screen.getByText(/READY, COMPLETE/i)).toBeInTheDocument();

    // check that the correct buttons are rendered
    expect(
      screen.queryByRole('button', { name: 'Restock' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Return' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Withdraw')).toBeInTheDocument();

    // check that the kit contents accordion is rendered
    expect(screen.getByText('Kit Contents')).toBeInTheDocument();

    // check that the kit history accordion is rendered
    expect(screen.getByText('Kit History')).toBeInTheDocument();
  });
  it('renders a retired kit correctly', () => {
    render(
      <KitInfoContent
        kitData={{
          ...exampleKit,
          status: 'RETIRED',
          content: null,
          complete: 'retired',
        }}
      />,
    );

    expect(screen.getByText('Test Kit')).toBeInTheDocument();
    expect(screen.getByText('Test Blueprint')).toBeInTheDocument();
    expect(screen.getByText(/RETIRED/i)).toBeInTheDocument();

    // check that the correct buttons are rendered
    expect(
      screen.queryByRole('button', { name: 'Restock' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Return' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Withdraw' }),
    ).not.toBeInTheDocument();

    // check that the kit contents accordion is rendered
    expect(screen.queryByText('Kit Contents')).toBeInTheDocument();

    // check that the kit history accordion is rendered
    expect(screen.getByText('Kit History')).toBeInTheDocument();
  });
});
