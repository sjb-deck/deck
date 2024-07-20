import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { useParams } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Api } from '../../../globals/api';
import { exampleKit, server } from '../../../mocks';
import { KitLoanReturn } from '../../../pages';
import { render } from '../../../testSetup';
import { getUrlWithoutParams } from '../../../utils';

describe('<KitLoanReturn />', () => {
  beforeEach(() => {
    server.use(
      http.get(getUrlWithoutParams(Api['kit']), () => {
        return HttpResponse.json(exampleKit, { status: 200 });
      }),
    );
    vi.mocked(useParams).mockReturnValue({ kitId: exampleKit.id });
  });
  it('renders the page', async () => {
    render(<KitLoanReturn />);

    await waitFor(() => {
      expect(screen.getByText(exampleKit.name)).toBeInTheDocument();
    });
  });

  it('renders error message when kit is not loaned out', async () => {
    server.use(
      http.get(getUrlWithoutParams(Api['kit']), () => {
        return HttpResponse.json(
          { ...exampleKit, status: 'Available' },
          { status: 200 },
        );
      }),
    );
    render(<KitLoanReturn />);

    await waitFor(() => {
      expect(screen.getByText('Kit is not loaned out')).toBeInTheDocument();
    });
  });

  it('renders error message when query params are not found', () => {
    vi.mocked(useParams).mockReturnValue({});
    render(<KitLoanReturn />);
    expect(screen.getByText('No Kit Id is passed!')).toBeInTheDocument();
  });
});
