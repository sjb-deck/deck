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
    // check if blueprints are rendered
    for (const blueprint of exampleBlueprint.blueprints) {
      expect(screen.getByText(blueprint.name)).toBeInTheDocument();
    }
  });

  it('renders blueprint content correctly upon clicking', async () => {
    render(<ViewExistingBlueprintTable items={exampleBlueprint.blueprints} />);
    // check that blueprints buttons are rendered
    for (const blueprint of exampleBlueprint.blueprints) {
      expect(
        screen.getByRole('button', {
          name: `${blueprint.id} ${blueprint.name}`,
        }),
      ).toBeInTheDocument();
    }

    // click on the first blueprint
    await userEvent.click(
      screen.getByRole('button', {
        name: `${exampleBlueprint.blueprints[0].id} ${exampleBlueprint.blueprints[0].name}`,
      }),
    );

    // check that blueprint content is rendered
    for (const item of exampleBlueprint.blueprints[0].complete_content) {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    }
  });
});
