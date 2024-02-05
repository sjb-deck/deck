import { screen } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';

import { ViewExistingBlueprintTable } from '../../../components/ItemList/ViewExistingBlueprintTable';
import { Api } from '../../../globals';
import { exampleBlueprint, server } from '../../../mocks';
import { render, userEvent } from '../../../testSetup';
import { getUrlWithoutParams } from '../../../utils';

describe('<ViewExistingBlueprintTable />', () => {
  beforeEach(() =>
    server.use(
      rest.get(getUrlWithoutParams(Api['kits']), (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(exampleBlueprint));
      }),
    ),
  );
  it('renders blueprint list correctly', () => {
    render(<ViewExistingBlueprintTable items={exampleBlueprint.blueprints} />);
    // check if header is rendered
    expect(screen.getByText('Blueprints')).toBeInTheDocument();
    // check if blueprints are rendered
    const itemNames = screen.queryAllByTestId('item_name');
    expect(itemNames.length > 0).toBe(true);
    expect(itemNames.some((ele) => ele.textContent == 'Blueprint Test1')).toBe(
      true,
    );
    expect(itemNames.some((ele) => ele.textContent == 'Blueprint Test2')).toBe(
      true,
    );
    expect(itemNames.some((ele) => ele.textContent == 'Arts')).toBe(true);
  });

  it('renders blueprint list correctly when list is empty', () => {
    render(<ViewExistingBlueprintTable items={[]} />);
    // check that headers is rendered
    expect(screen.queryByText('Blueprints')).toBeInTheDocument();
  });

  it('renders blueprint content correctly upon clicking', async () => {
    render(<ViewExistingBlueprintTable items={exampleBlueprint.blueprints} />);
    const blueprints = screen.queryAllByTestId('item_accordion');
    // check that none of the blueprint content is rendered
    expect(
      blueprints.every((ele) => ele.getAttribute('aria-expanded') == 'false'),
    ).toBe(true);
    // check that blueprint content is rendered upon clicking
    await userEvent.click(blueprints[0]);
    expect(
      blueprints.some((ele) => ele.getAttribute('aria-expanded') == 'true'),
    ).toBe(true);
    expect(screen.getByText('Bandage Test')).toBeVisible();
    expect(screen.getByText('Tape Test')).toBeVisible();
    expect(screen.getByText('Test Fail Paper')).not.toBeVisible();
    expect(screen.getByText('Test Fail Scissors')).not.toBeVisible();
    const contentQty = screen.queryAllByTestId('blueprint_item_qty');
    expect(contentQty.some((ele) => ele.textContent == 'test5')).toBe(true);
    expect(contentQty.some((ele) => ele.textContent == 'test2')).toBe(true);
  });
});
