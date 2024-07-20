import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { KitItemReturnSection } from '../../../components';
import { render } from '../../../testSetup';

describe('<KitItemReturnSection />', () => {
  const mockKitData = [
    {
      id: 2,
      name: 'test expiry',
      quantity: 2,
      newQuantity: 2,
      shown_quantity: 2,
      blueprintQuantity: 2,
      expiry_date: '2023-07-23',
    },
  ];
  it('renders the kit item return section', () => {
    render(
      <KitItemReturnSection kitData={mockKitData} updateKitData={vi.fn()} />,
    );

    expect(
      screen.getByRole('heading', { name: 'Kit Content' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Item' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Expiry Date' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Quantity' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Remaining' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('rowheader', { name: 'test expiry' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', { name: '2023-07-23' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('row', { name: 'test expiry 2023-07-23 2 2' }),
    ).toBeInTheDocument();
  });
});
