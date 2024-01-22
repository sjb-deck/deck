import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';

import { Api } from '../../../globals';
import { exampleKit, exampleKitRestockOptions, server } from '../../../mocks';
import { KitRestock } from '../../../pages/kitRestock';
import { render } from '../../../testSetup/';
import { getUrlWithoutParams } from '../../../utils';

describe('<KitRestock />', () => {
  it('should render correctly', async () => {
    const mockKitId = '31';
    global.URLSearchParams = jest.fn(() => ({
      get: jest.fn().mockReturnValue(mockKitId),
    }));
    server.use(
      rest.get(getUrlWithoutParams(Api['kit']), (req, res, ctx) => {
        return res(
          ctx.json({
            ...exampleKit,
            id: mockKitId,
            status: 'READY',
            complete: 'incomplete',
          }),
        );
      }),
      rest.get(
        Api['kitRestockOptions'].replace(':id', mockKitId),
        (req, res, ctx) => {
          return res(ctx.json(exampleKitRestockOptions));
        },
      ),
    );
    render(<KitRestock />);

    await waitForElementToBeRemoved(() =>
      screen.getByTestId('loading-spinner'),
    );

    // check if kit info is rendered
    expect(screen.getByText(exampleKit.name)).toBeInTheDocument();
    expect(screen.getByText(exampleKit.blueprint_name)).toBeInTheDocument();
    expect(screen.getByText(/READY, incomplete/)).toBeInTheDocument();

    // check if item options are rendered
    for (const item of exampleKitRestockOptions) {
      expect(screen.getByText(item.item_name)).toBeInTheDocument();
      expect(
        screen.getByText(
          `${item.current_quantity} / ${item.required_quantity}`,
        ),
      ).toBeInTheDocument();
    }
  });

  describe('Renders correctly when kit is ', () => {
    it('LOANED', async () => {
      const mockKitId = '31';
      global.URLSearchParams = jest.fn(() => ({
        get: jest.fn().mockReturnValue(mockKitId),
      }));
      server.use(
        rest.get(getUrlWithoutParams(Api['kit']), (req, res, ctx) => {
          return res(
            ctx.json({
              ...exampleKit,
              id: mockKitId,
              status: 'LOANED',
              complete: 'incomplete',
            }),
          );
        }),
      );
      render(<KitRestock />);
      await waitForElementToBeRemoved(() =>
        screen.getByTestId('loading-spinner'),
      );

      expect(
        screen.getByText('Kit cannot be restocked at this time'),
      ).toBeInTheDocument();
    });
    it('COMPLETE', async () => {
      const mockKitId = '31';
      global.URLSearchParams = jest.fn(() => ({
        get: jest.fn().mockReturnValue(mockKitId),
      }));
      server.use(
        rest.get(getUrlWithoutParams(Api['kit']), (req, res, ctx) => {
          return res(
            ctx.json({
              ...exampleKit,
              id: mockKitId,
              status: 'READY',
              complete: 'COMPLETE',
            }),
          );
        }),
      );
      render(<KitRestock />);

      await waitForElementToBeRemoved(() =>
        screen.getByTestId('loading-spinner'),
      );

      expect(
        screen.getByText('Kit cannot be restocked at this time'),
      ).toBeInTheDocument();
    });
  });
});
