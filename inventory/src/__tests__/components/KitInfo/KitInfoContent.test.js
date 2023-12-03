import { screen } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';

import { KitInfoContent } from '../../../components';
import { Api } from '../../../globals';
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
      rest.get(getUrlWithoutParams(Api['kitHistory']), (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(exampleKitHistory));
      }),
      rest.get(
        buildUrl(Api['kitRecipe'], { id: exampleKit.blueprint_id }),
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(exampleKitRecipe));
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
    expect(screen.queryByText('Restock')).toBeInTheDocument();

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
    expect(screen.queryByText('Restock')).not.toBeInTheDocument();
    expect(screen.queryByText('Return')).not.toBeInTheDocument();
    expect(screen.getByText('Withdraw')).toBeInTheDocument();

    // check that the kit contents accordion is rendered
    expect(screen.getByText('Kit Contents')).toBeInTheDocument();

    // check that the kit history accordion is rendered
    expect(screen.getByText('Kit History')).toBeInTheDocument();
  });
});
