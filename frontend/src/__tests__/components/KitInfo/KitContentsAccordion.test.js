import { screen } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';

import { KitContentsAccordion } from '../../../components/KitInfo/KitContentsAccordion';
import { Api } from '../../../globals';
import { exampleKit, exampleKitBlueprint, server } from '../../../mocks';
import { render } from '../../../testSetup';
import { buildUrl, getUrlWithoutParams } from '../../../utils';

describe('<KitContentsAccordion />', () => {
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
  it('renders kit contents correctly', () => {
    render(
      <KitContentsAccordion
        kitContents={exampleKit.content}
        kitBlueprint={exampleKitBlueprint}
      />,
    );

    expect(screen.getByText('Kit Contents')).toBeInTheDocument();
    // check if headers are rendered
    expect(
      screen.getByRole('columnheader', { name: 'Item' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Expiry' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Qty' }),
    ).toBeInTheDocument();
    // check if items are rendered
    expect(
      screen.getByRole('row', { name: 'test expiry 1 / 4 2023-07-23' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('row', { name: 'something new1 0 / 2 NIL' }),
    ).toBeInTheDocument();
  });

  it('renders kit contents correctly when there are multiple expirys for same item', () => {
    const modifiedKitContents = [
      ...exampleKit.content,
      {
        ...exampleKit.content[0],
        item_expiry_id: 3,
        item_expiry: {
          ...exampleKit.content[0].item_expiry,
          id: 3,
          expiry_date: '2033-07-13',
        },
      },
    ];

    render(
      <KitContentsAccordion
        kitContents={modifiedKitContents}
        kitBlueprint={exampleKitBlueprint}
      />,
    );

    expect(screen.getByText('Kit Contents')).toBeInTheDocument();
    // check if headers are rendered
    expect(
      screen.getByRole('columnheader', { name: 'Item' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Expiry' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Qty' }),
    ).toBeInTheDocument();
    // check if items are rendered
    expect(
      screen.getByRole('row', { name: 'test expiry 1 / 4 2023-07-23' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('row', { name: 'test expiry 1 / 4 2033-07-13' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('row', { name: 'something new1 0 / 2 NIL' }),
    ).toBeInTheDocument();
  });
  it('renders kit contents correctly when kit is empty', () => {
    render(
      <KitContentsAccordion
        kitContents={null}
        kitBlueprint={exampleKitBlueprint}
      />,
    );

    expect(screen.getByText('Kit Contents')).toBeInTheDocument();
    // check if headers are rendered
    expect(
      screen.getByRole('columnheader', { name: 'Item' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Expiry' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Qty' }),
    ).toBeInTheDocument();

    // check that items are rendered
    expect(
      screen.getByRole('row', { name: 'something new1 0 / 2 NIL' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('row', { name: 'test expiry 0 / 4 NIL' }),
    ).toBeInTheDocument();
  });
});
