import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { useParams } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Api } from '../../../globals/api';
import { exampleKit, exampleKitRestockOptions, server } from '../../../mocks';
import { KitRestock } from '../../../pages';
import { render } from '../../../testSetup';
import { getUrlWithoutParams } from '../../../utils';

describe('<KitRestock />', () => {
  const mockKitId = '31';
  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({ kitId: mockKitId });
  });
  it('should render correctly', async () => {
    server.use(
      http.get(getUrlWithoutParams(Api['kit']), () => {
        return HttpResponse.json(
          {
            ...exampleKit,
            id: mockKitId,
            status: 'READY',
            complete: 'incomplete',
          },
          { status: 200 },
        );
      }),
      http.get(Api['kitRestockOptions'].replace(':id', mockKitId), () => {
        return HttpResponse.json(exampleKitRestockOptions, { status: 200 });
      }),
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
      server.use(
        http.get(getUrlWithoutParams(Api['kit']), () => {
          return HttpResponse.json(
            {
              ...exampleKit,
              id: mockKitId,
              status: 'LOANED',
              complete: 'incomplete',
              name: 'Loaned Kit',
            },
            { status: 200 },
          );
        }),
      );

      render(<KitRestock />);

      await waitFor(() =>
        screen.getByText('Kit cannot be restocked at this time'),
      );
    });
    it('COMPLETE', async () => {
      server.use(
        http.get(getUrlWithoutParams(Api['kit']), () => {
          return HttpResponse.json(
            {
              ...exampleKit,
              id: mockKitId,
              status: 'READY',
              complete: 'COMPLETE',
              name: 'Complete Kit',
            },
            { status: 200 },
          );
        }),
      );

      render(<KitRestock />);

      await waitFor(() =>
        screen.getByText('Kit cannot be restocked at this time'),
      );
    });
  });
});
