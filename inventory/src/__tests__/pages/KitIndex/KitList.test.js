import {
  act,
  fireEvent,
  screen,
  within,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import { KitIndex } from '../../../pages';
import { render } from '../../../testSetup';
describe('Kit List', () => {
  it('should display kits correctly', async () => {
    act(() => {
      render(<KitIndex />);
    });
    await waitFor(() => {
      expect(screen.getAllByText('Ready')[0]).toBeInTheDocument();
    });

    const tableHeader = ['ID', 'Name', 'Status', 'Complete'];

    for (const name of tableHeader) {
      const header = screen.getAllByText(name)[0];
      expect(header).toBeInTheDocument();
    }

    const testRow = [30, 'Test Kit', 'Ready', 'Complete'];
    for (const detail of testRow) {
      const info = screen.getAllByText(detail)[0];
      expect(info).toBeInTheDocument();
    }
  });

  it('should expand kit accordion onclick', async () => {
    act(() => {
      render(<KitIndex />);
    });
    await waitFor(() => {
      expect(screen.getAllByText('Ready')[0]).toBeInTheDocument();
    });
    const accordion = screen.getAllByTestId('details-30')[0];
    expect(accordion).not.toBeVisible();

    const kit = screen.getAllByText('30')[0];
    fireEvent.click(kit);

    expect(accordion).toBeVisible();

    const kitDetails = ['test expiry', '4', 'something new1', '2'];

    for (const detail of kitDetails) {
      const info = within(accordion).getAllByText(detail)[0];
      expect(info).toBeInTheDocument();
    }
  });

  it('should have the correct action buttons', async () => {
    act(() => {
      render(<KitIndex />);
    });
    await waitFor(() => {
      expect(screen.getAllByText('Ready')[0]).toBeInTheDocument();
    });
    const accordion = screen.getAllByTestId('details-30')[0];
    const kit = screen.getAllByText('30')[0];
    fireEvent.click(kit);

    expect(within(accordion).getAllByText('Return')[0]).toBeInTheDocument();

    const accordion2 = screen.getAllByTestId('details-31')[0];
    const kit2 = screen.getAllByText('31')[0];
    fireEvent.click(kit2);

    expect(within(accordion2).getAllByText('Withdraw')[0]).toBeInTheDocument();
    expect(within(accordion2).getAllByText('Restock')[0]).toBeInTheDocument();
  });
});
