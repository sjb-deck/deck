import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';

import { KitHistoryList } from '../../../components';
import { Api } from '../../../globals';
import { exampleKitHistory, server } from '../../../mocks';
import { render, userEvent } from '../../../testSetup';
import { getUrlWithoutParams } from '../../../utils';

describe('<KitHistoryList />', () => {
  it('should render correctly', async () => {
    server.use(
      rest.get(getUrlWithoutParams(Api['kitHistory']), (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(exampleKitHistory));
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
      within(screen.getByRole('search-select')).getByRole('button', {
        name: 'Kit',
      }),
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
        name: '65 LOAN 1 Dec 2023 - 12:33 Test kit',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: '59 RESTOCK 30 Nov 2023 - 22:01 Test kit',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: '58 LOAN 30 Nov 2023 - 21:58 Test kit',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: '54 CREATION 16 Nov 2023 - 00:46 Test kit',
      }),
    ).toBeInTheDocument();

    // check that pagination is rendered
    expect(screen.getByRole('button', { name: 'page 1' })).toBeInTheDocument();
  });

  describe('should call API correctly when search is used with ', () => {
    it('kit name filter', async () => {
      let lastRequest;
      server.use(
        rest.get(getUrlWithoutParams(Api['kitHistory']), (req, res, ctx) => {
          lastRequest = req;
          return res(ctx.status(200), ctx.json(exampleKitHistory));
        }),
      );
      render(<KitHistoryList />);

      await waitFor(() => expect(lastRequest).not.toBeUndefined());

      // test kit name search
      lastRequest = undefined;
      await userEvent.type(screen.getByLabelText('Search'), 'test kit');
      await waitFor(() => expect(lastRequest).not.toBeUndefined());
      expect(lastRequest.url.searchParams.get('kitName')).toEqual('test kit');
    });
    it('type filter', async () => {
      let lastRequest;
      server.use(
        rest.get(getUrlWithoutParams(Api['kitHistory']), (req, res, ctx) => {
          lastRequest = req;
          return res(ctx.status(200), ctx.json(exampleKitHistory));
        }),
      );
      render(<KitHistoryList />);

      // test type search
      await userEvent.click(
        within(screen.getByRole('search-select')).getByRole('button', {
          name: 'Kit',
        }),
      );
      await userEvent.click(screen.getByRole('option', { name: 'Type' }));
      lastRequest = undefined;
      await userEvent.type(screen.getByLabelText('Search'), 'loan');
      await waitFor(() => expect(lastRequest).not.toBeUndefined());
      expect(lastRequest.url.searchParams.get('type')).toEqual('loan');
    });
    it('loanee name filter', async () => {
      let lastRequest;
      server.use(
        rest.get(getUrlWithoutParams(Api['kitHistory']), (req, res, ctx) => {
          lastRequest = req;
          return res(ctx.status(200), ctx.json(exampleKitHistory));
        }),
      );
      render(<KitHistoryList />);

      // test loanee name search
      await userEvent.click(
        within(screen.getByRole('search-select')).getByRole('button', {
          name: 'Kit',
        }),
      );
      await userEvent.click(screen.getByRole('option', { name: 'Loanee' }));
      lastRequest = undefined;
      await userEvent.type(screen.getByLabelText('Search'), 'tester');
      await waitFor(() => expect(lastRequest).not.toBeUndefined());
      expect(lastRequest.url.searchParams.get('loaneeName')).toEqual('tester');
    });
    it('user filter', async () => {
      let lastRequest;
      server.use(
        rest.get(getUrlWithoutParams(Api['kitHistory']), (req, res, ctx) => {
          lastRequest = req;
          return res(ctx.status(200), ctx.json(exampleKitHistory));
        }),
      );
      render(<KitHistoryList />);

      // test user search
      await userEvent.click(
        within(screen.getByRole('search-select')).getByRole('button', {
          name: 'Kit',
        }),
      );
      await userEvent.click(screen.getByRole('option', { name: 'User' }));
      lastRequest = undefined;
      await userEvent.type(screen.getByLabelText('Search'), 'demo');
      await waitFor(() => expect(lastRequest).not.toBeUndefined());
      expect(lastRequest.url.searchParams.get('user')).toEqual('demo');
    });
  });
});
