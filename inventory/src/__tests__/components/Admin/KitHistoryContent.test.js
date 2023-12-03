import { screen, within } from '@testing-library/react';
import React from 'react';

import { KitHistoryContent } from '../../../components/Admin/KitHistoryContent';
import {
  exampleKitHistory,
  exampleRetireKitHistoryEntry,
} from '../../../mocks';
import { render, userEvent } from '../../../testSetup';

describe('<KitHistoryContent />', () => {
  describe('should render content correctly when history type is ', () => {
    it('LOAN', async () => {
      render(
        <KitHistoryContent
          history={exampleKitHistory.results[0]}
          isMobile={true}
          isLoading={false}
          handleDeleteHistory={jest.fn()}
        />,
      );

      // expand accordion
      await userEvent.click(
        screen.getByRole('button', {
          name: '65 LOAN 1 Dec 2023 - 12:33 Test kit',
        }),
      );

      // check that accordion details is rendered
      expect(screen.getByTestId('details-65')).toBeInTheDocument();

      // check that loanee name is rendered
      expect(screen.getByTestId('details-65')).toHaveTextContent(
        'Loanee Name:',
      );
      expect(screen.getByTestId('details-65')).toHaveTextContent('tester');

      // check that due date is rendered
      expect(screen.getByTestId('details-65')).toHaveTextContent(
        'Return Deadline:',
      );
      expect(screen.getByTestId('details-65')).toHaveTextContent('30 Dec 2023');

      // check that ordered by is rendered
      expect(screen.getByTestId('details-65')).toHaveTextContent('Ordered by:');
      expect(screen.getByTestId('details-65')).toHaveTextContent('demo');

      // check that loan status is not returned
      expect(screen.getByTestId('details-65')).toHaveTextContent(
        'Loan Status:',
      );
      expect(screen.getByTestId('details-65')).toHaveTextContent('Active');

      // check that kit ID is rendered
      expect(screen.getByTestId('details-65')).toHaveTextContent('Kit ID:');
      expect(screen.getByTestId('details-65')).toHaveTextContent('30');

      // check that return date is not rendered
      expect(screen.queryByText('Returned date:')).not.toBeInTheDocument();

      // check that snapshot is rendered
      expect(screen.getByTestId('details-65')).toHaveTextContent('Snapshot');
      for (const item of exampleKitHistory.results[0].snapshot) {
        expect(screen.getByTestId('details-65')).toHaveTextContent(
          item.item_expiry.item.name,
        );
        expect(screen.getByTestId('details-65')).toHaveTextContent(
          item.quantity,
        );
        expect(
          within(screen.getByTestId('details-65')).getByRole('expiry-date', {
            name: item.item_expiry.expiry_date ?? 'No expiry',
          }),
        ).toBeInTheDocument();
      }
    });
    it('RESTOCK', async () => {
      render(
        <KitHistoryContent
          history={exampleKitHistory.results[1]}
          isMobile={true}
          isLoading={false}
          handleDeleteHistory={jest.fn()}
        />,
      );

      // expand accordion
      await userEvent.click(
        screen.getByRole('button', {
          name: '59 RESTOCK 30 Nov 2023 - 22:01 Test kit',
        }),
      );

      // check that accordion details is rendered
      expect(screen.getByTestId('details-59')).toBeInTheDocument();

      // check that ordered by is rendered
      expect(screen.getByTestId('details-59')).toHaveTextContent('Ordered by:');
      expect(screen.getByTestId('details-59')).toHaveTextContent('demo');

      // check that order ID is rendered
      expect(screen.getByTestId('details-59')).toHaveTextContent('Order ID:');
      expect(screen.getByTestId('details-59')).toHaveTextContent('141');

      // check that kit ID is rendered
      expect(screen.getByTestId('details-59')).toHaveTextContent('Kit ID:');
      expect(screen.getByTestId('details-59')).toHaveTextContent('30');

      // check that snapshot is rendered
      expect(screen.getByTestId('details-59')).toHaveTextContent('Snapshot');
      for (const item of exampleKitHistory.results[1].snapshot) {
        expect(screen.getByTestId('details-59')).toHaveTextContent(
          item.item_expiry.item.name,
        );
        expect(screen.getByTestId('details-59')).toHaveTextContent(
          item.quantity,
        );
        expect(
          within(screen.getByTestId('details-59')).getByRole('expiry-date', {
            name: item.item_expiry.expiry_date ?? 'No expiry',
          }),
        ).toBeInTheDocument();
      }
    });
    it('CREATION', async () => {
      render(
        <KitHistoryContent
          history={exampleKitHistory.results[3]}
          isMobile={true}
          isLoading={false}
          handleDeleteHistory={jest.fn()}
        />,
      );

      // expand accordion
      await userEvent.click(
        screen.getByRole('button', {
          name: '54 CREATION 16 Nov 2023 - 00:46 Test kit',
        }),
      );

      // check that accordion details is rendered
      expect(screen.getByTestId('details-54')).toBeInTheDocument();

      // check that ordered by is rendered
      expect(screen.getByTestId('details-54')).toHaveTextContent('Ordered by:');
      expect(screen.getByTestId('details-54')).toHaveTextContent('Jonas');

      // check that order ID is rendered
      expect(screen.getByTestId('details-54')).toHaveTextContent('Order ID:');
      expect(screen.getByTestId('details-54')).toHaveTextContent('135');

      // check that kit ID is rendered
      expect(screen.getByTestId('details-54')).toHaveTextContent('Kit ID:');
      expect(screen.getByTestId('details-54')).toHaveTextContent('30');

      // check that snapshot is rendered
      expect(screen.getByTestId('details-54')).toHaveTextContent('Snapshot');
      for (const item of exampleKitHistory.results[3].snapshot) {
        expect(screen.getByTestId('details-54')).toHaveTextContent(
          item.item_expiry.item.name,
        );
        expect(screen.getByTestId('details-54')).toHaveTextContent(
          item.quantity,
        );
        expect(
          within(screen.getByTestId('details-54')).getByRole('expiry-date', {
            name: item.item_expiry.expiry_date ?? 'No expiry',
          }),
        ).toBeInTheDocument();
      }
    });
    it('RETIRE', async () => {
      render(
        <KitHistoryContent
          history={exampleRetireKitHistoryEntry}
          isMobile={true}
          isLoading={false}
          handleDeleteHistory={jest.fn()}
        />,
      );

      // expand accordion
      await userEvent.click(
        screen.getByRole('button', {
          name: '70 RETIREMENT 3 Dec 2023 - 21:54 Test Kit',
        }),
      );

      // check that accordion details is rendered
      expect(screen.getByTestId('details-70')).toBeInTheDocument();

      // check that ordered by is rendered
      expect(screen.getByTestId('details-70')).toHaveTextContent('Ordered by:');
      expect(screen.getByTestId('details-70')).toHaveTextContent('demo');

      // check that order ID is rendered
      expect(screen.getByTestId('details-70')).toHaveTextContent('Order ID:');
      expect(screen.getByTestId('details-70')).toHaveTextContent('146');

      // check that kit ID is rendered
      expect(screen.getByTestId('details-70')).toHaveTextContent('Kit ID:');
      expect(screen.getByTestId('details-70')).toHaveTextContent('30');

      // check that snapshot is not rendered
      expect(screen.queryByText('Snapshot')).not.toBeInTheDocument();
    });
    it('calls handleDeleteHistory correctly when revert history button is clicked', async () => {
      const mockDeleteHistory = jest.fn();
      render(
        <KitHistoryContent
          history={exampleKitHistory.results[0]}
          isMobile={true}
          isLoading={false}
          handleDeleteHistory={mockDeleteHistory}
        />,
      );

      // expand accordion
      await userEvent.click(
        screen.getByRole('button', {
          name: '65 LOAN 1 Dec 2023 - 12:33 Test kit',
        }),
      );

      // click on the revert history button
      await userEvent.click(
        screen.getByRole('button', {
          name: 'Revert History',
        }),
      );

      // check that confirmation dialog is rendered
      expect(
        screen.getByText('Are you sure you want to revert this history?'),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Cancel' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('submit-button')).toBeInTheDocument();
      expect(mockDeleteHistory).toHaveBeenCalledTimes(0);
      await userEvent.click(screen.getByRole('submit-button'));

      // check that API is called correctly
      expect(mockDeleteHistory).toHaveBeenCalledTimes(1);
    });
  });
});
