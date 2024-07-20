import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { KitHistoryList } from '../../../components';
import { Api } from '../../../globals/api';
import { exampleKitHistory, server } from '../../../mocks';
import { render, userEvent } from '../../../testSetup';
import { getUrlWithoutParams } from '../../../utils';

describe('<KitHistoryList />', () => {
  it('should render correctly', async () => {
    server.use(
      http.get(getUrlWithoutParams(Api['kitHistory']), () => {
        return HttpResponse.json(exampleKitHistory);
      }),
    );
    render(<KitHistoryList />);

    await waitForElementToBeRemoved(() =>
      screen.getByTestId('loading-spinner'),
    );

    // check that search and filter bar is rendered
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByRole('search-select')).toBeInTheDocument();
    await userEvent.click(
      within(screen.getByRole('search-select')).getByRole('combobox'),
    );
    expect(screen.getByRole('option', { name: 'Kit' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Type' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Loanee' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'User' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('option', { name: 'Kit' }));

    // check that table is rendered
    expect(
      screen.getByRole('button', { name: 'ID Type Date Kit' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: '65 Loan 1 Dec 2023 - 12:33 Test kit',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: '59 Restock 30 Nov 2023 - 22:01 Test kit',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: '58 Loan 30 Nov 2023 - 21:58 Test kit',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: '54 Creation 16 Nov 2023 - 00:46 Test kit',
      }),
    ).toBeInTheDocument();

    // check that pagination is rendered
    expect(screen.getByRole('button', { name: 'page 1' })).toBeInTheDocument();
  });

  describe('should call API correctly when search is used with ', () => {
    it('kit name filter', async () => {
      let lastKitName;
      server.use(
        http.get(getUrlWithoutParams(Api['kitHistory']), ({ request }) => {
          const url = new URL(request.url);
          lastKitName = url.searchParams.get('kitName');
          return HttpResponse.json(exampleKitHistory);
        }),
      );
      render(<KitHistoryList />);

      await waitFor(() => expect(lastKitName).not.toBeUndefined());

      // test kit name search
      lastKitName = undefined;
      await userEvent.type(screen.getByLabelText('Search'), 'test kit');
      await waitFor(() => expect(lastKitName).not.toBeUndefined());
      expect(lastKitName).toEqual('test kit');
    });
    it('type filter', async () => {
      let lastKitType;
      server.use(
        http.get(getUrlWithoutParams(Api['kitHistory']), ({ request }) => {
          const url = new URL(request.url);
          lastKitType = url.searchParams.get('type');
          return HttpResponse.json(exampleKitHistory);
        }),
      );
      render(<KitHistoryList />);

      // test type search
      await userEvent.click(
        within(screen.getByRole('search-select')).getByRole('combobox'),
      );
      await userEvent.click(screen.getByRole('option', { name: 'Type' }));
      lastKitType = undefined;
      await userEvent.type(screen.getByLabelText('Search'), 'loan');
      await waitFor(() => expect(lastKitType).not.toBeUndefined());
      expect(lastKitType).toEqual('loan');
    });
    it('loanee name filter', async () => {
      let lastLoaneeName;
      server.use(
        http.get(getUrlWithoutParams(Api['kitHistory']), ({ request }) => {
          const url = new URL(request.url);
          lastLoaneeName = url.searchParams.get('loaneeName');
          return HttpResponse.json(exampleKitHistory);
        }),
      );
      render(<KitHistoryList />);

      // test loanee name search
      await userEvent.click(
        within(screen.getByRole('search-select')).getByRole('combobox'),
      );
      await userEvent.click(screen.getByRole('option', { name: 'Loanee' }));
      lastLoaneeName = undefined;
      await userEvent.type(screen.getByLabelText('Search'), 'tester');
      await waitFor(() => expect(lastLoaneeName).not.toBeUndefined());
      expect(lastLoaneeName).toEqual('tester');
    });
    it('user filter', async () => {
      let lastUser;
      server.use(
        http.get(getUrlWithoutParams(Api['kitHistory']), ({ request }) => {
          const url = new URL(request.url);
          lastUser = url.searchParams.get('user');
          return HttpResponse.json(exampleKitHistory);
        }),
      );
      render(<KitHistoryList />);

      // test user search
      await userEvent.click(
        within(screen.getByRole('search-select')).getByRole('combobox'),
      );
      await userEvent.click(screen.getByRole('option', { name: 'User' }));
      lastUser = undefined;
      await userEvent.type(screen.getByLabelText('Search'), 'demo');
      await waitFor(() => expect(lastUser).not.toBeUndefined());
      expect(lastUser).toEqual('demo');
    });
  });
});
