import { screen, waitFor, within } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';

import { KitHistoryTimeline } from '../../../components/KitInfo/KitHistoryTimeline';
import { Api } from '../../../globals';
import {
  exampleKitHistory,
  exampleRetireKitHistoryEntry,
  server,
} from '../../../mocks';
import { render, userEvent } from '../../../testSetup';
import { buildUrl } from '../../../utils';

describe('<KitHistoryTimeline />', () => {
  afterEach(() => jest.restoreAllMocks());
  it('renders correctly', async () => {
    render(<KitHistoryTimeline histories={exampleKitHistory.results} />);

    // check that histories are rendered correctly
    for (const history of exampleKitHistory.results) {
      expect(
        screen.getByRole('listitem', { name: `history ${history.id}` }),
      ).toBeInTheDocument();
      const historyItem = screen.getByRole('listitem', {
        name: `history ${history.id}`,
      });
      // check content on timeline is rendered correctly
      switch (history.action) {
        case 'LOAN':
          expect(
            within(historyItem).getByText(
              `Loaned to ${history.loan_info.loanee_name} by ${history.person.username}`,
            ),
          ).toBeInTheDocument();
          break;
        case 'RESTOCK':
          expect(
            within(historyItem).getByText(
              `Restock by ${history.person.username}`,
            ),
          ).toBeInTheDocument();
          break;
        case 'CREATION':
          expect(
            within(historyItem).getByText(
              `Created by ${history.person.username}`,
            ),
          ).toBeInTheDocument();
        case 'RETIREMENT':
          expect(
            within(historyItem).getByText(
              `Retired by ${history.person.username}`,
            ),
          ).toBeInTheDocument();
      }
      // check that modal is rendered when timeline item is clicked
      await userEvent.click(historyItem);

      await waitFor(() => screen.getByRole('history-modal'));

      // check that modal content is rendered correctly
      expect(screen.getByText('History Details')).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Item' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Expiry' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Qty' }),
      ).toBeInTheDocument();
      for (const item of history.snapshot) {
        expect(
          screen.getByRole('row', {
            name: `${item.item_expiry.item.name} ${item.quantity} ${item.item_expiry.expiry_date}`,
          }),
        ).toBeInTheDocument();
      }
      if (history.id === exampleKitHistory.results[0].id) {
        expect(
          screen.getByRole('button', { name: 'Delete History' }),
        ).toBeInTheDocument();
      } else {
        expect(
          screen.queryByRole('button', { name: 'Delete History' }),
        ).not.toBeInTheDocument();
      }

      // close the modal
      await userEvent.click(screen.getByTestId('close-history-modal-button'));
    }
  });

  it('calls API correctly to delete history', async () => {
    let request = null;
    jest.spyOn(window, 'confirm').mockImplementation(() => {
      return true;
    });
    server.use(
      rest.get(
        buildUrl(Api['revertHistory'], { id: exampleKitHistory.results[0].id }),
        (req, res, ctx) => {
          request = req;
          return res(ctx.status(200));
        },
      ),
    );
    render(<KitHistoryTimeline histories={exampleKitHistory.results} />);

    // open the first modal
    await userEvent.click(
      screen.getByRole('listitem', {
        name: `history ${exampleKitHistory.results[0].id}`,
      }),
    );
    await waitFor(() => screen.getByRole('history-modal'));

    // delete the history
    await userEvent.click(
      screen.getByRole('button', { name: 'Delete History' }),
    );

    await waitFor(() => expect(request).not.toBeNull());

    // check that API is called correctly
    const pathParts = request.url.pathname.split('/');
    expect(parseInt(pathParts[pathParts.length - 1])).toBe(
      exampleKitHistory.results[0].id,
    );
  });

  it('renders correctly when there are no histories', () => {
    render(<KitHistoryTimeline histories={[]} />);

    expect(screen.getByText('Nothing found!')).toBeInTheDocument();
    expect(screen.getByText('There are no histories')).toBeInTheDocument();
  });
  it('renders correctly when there is no snapshot', async () => {
    render(<KitHistoryTimeline histories={[exampleRetireKitHistoryEntry]} />);

    // open the modal
    await userEvent.click(
      screen.getByRole('listitem', {
        name: `history ${exampleRetireKitHistoryEntry.id}`,
      }),
    );

    // check that modal content is rendered correctly
    expect(screen.getByText('History Details')).toBeInTheDocument();
    expect(screen.queryByText('Snapshot')).not.toBeInTheDocument();
  });

  it('displays delete button correctly', async () => {
    render(<KitHistoryTimeline histories={exampleKitHistory.results} />);

    // open the first modal
    await userEvent.click(
      screen.getByRole('listitem', {
        name: `history ${exampleKitHistory.results[0].id}`,
      }),
    );

    // check that delete button is displayed for the first history
    expect(
      screen.getByRole('button', { name: 'Delete History' }),
    ).toBeInTheDocument();

    // close the modal
    await userEvent.click(screen.getByTestId('close-history-modal-button'));

    // open the second modal
    await userEvent.click(
      screen.getByRole('listitem', {
        name: `history ${exampleKitHistory.results[1].id}`,
      }),
    );

    // check that delete button is not displayed for the second history
    expect(
      screen.queryByRole('button', { name: 'Delete History' }),
    ).not.toBeInTheDocument();
  });
});
