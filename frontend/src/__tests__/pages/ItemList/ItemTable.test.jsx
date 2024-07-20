import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ItemTable } from '../../../components';
import { mockExpiryList } from '../../../mocks/itemList';

describe('Item Table', () => {
  it('should render the Item Table properly', async () => {
    render(<ItemTable items={mockExpiryList} />);

    const tableHeadings = [
      'Item Name',
      'Type',
      'Expiry Date',
      'Unit',
      'Total Qty',
      'Opened',
    ];

    for (const heading of tableHeadings) {
      const element = screen.getAllByText(heading)[0];
      expect(element).toBeInTheDocument();
    }

    const itemDetails = [
      'test expiry',
      'Misc',
      '2023-08-19',
      'units',
      '2',
      'No',
    ];

    const row = screen.getByTestId('item-row-41');
    expect(row).toBeInTheDocument();

    for (const detail of itemDetails) {
      const element = within(row).getAllByText(detail)[0];
      expect(element).toBeInTheDocument();
    }
  });

  it('Search filter works', async () => {
    render(<ItemTable items={mockExpiryList} />);

    const searchInput = screen.getByLabelText('Search');
    const selectInput = screen.getByTestId('type-select');

    expect(selectInput).toBeInTheDocument();
    expect(selectInput).toHaveValue('All');

    expect(screen.getByTestId('item-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-row-43')).toBeInTheDocument();
    expect(screen.getByTestId('item-row-46')).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'test eXp' } });

    expect(screen.getByTestId('item-row-2')).toBeInTheDocument();
    expect(screen.queryByTestId('item-row-43')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-row-46')).not.toBeInTheDocument();

    fireEvent.change(selectInput, { target: { value: 'Misc' } });
    fireEvent.change(searchInput, { target: { value: '' } });

    expect(screen.getByTestId('item-row-2')).toBeInTheDocument();
    expect(screen.queryByTestId('item-row-43')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-row-46')).not.toBeInTheDocument();

    fireEvent.change(selectInput, { target: { value: 'General' } });

    expect(screen.queryByTestId('item-row-2')).not.toBeInTheDocument();
    expect(screen.getByTestId('item-row-43')).toBeInTheDocument();
    expect(screen.getByTestId('item-row-46')).toBeInTheDocument();
  });
});
