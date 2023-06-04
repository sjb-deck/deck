import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ItemContainer from './ItemContainer';

const mockItem = {
  id: 1,
  name: 'Scissors',
  type: 'General',
  unit: 'pair',
  imgpic: 'item_img/F5099948-01.jpeg',
  total_quantityopen: 0,
  total_quantityunopened: 0,
  min_quantityopen: 0,
  min_quantityunopened: 0,
  expirydates: [
    {
      id: 1,
      expirydate: '2023-06-02',
      quantityopen: 0,
      quantityunopened: 1,
      item: 1,
      archived: false,
    },
  ],
};
describe('ItemContainer', () => {
  test('renders the component correctly', () => {
    render(<ItemContainer index={0} item={mockItem} />);

    expect(screen.getByText(/Scissors/i)).toBeInTheDocument();
    expect(screen.getByText(/Unit: pair/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Qty: 0/i)).toBeInTheDocument();
    expect(screen.getByText(/^Opened Qty: 0$/)).toBeInTheDocument();
    expect(screen.getByText(/^Unopened Qty: 0$/)).toBeInTheDocument();
  });

  test('handles expiry date changes', () => {
    render(<ItemContainer index={0} item={mockItem} />);
    fireEvent.click(screen.getByText('All'));
    expect(screen.getByText(/Total Qty: 0/i)).toBeInTheDocument();
    expect(screen.getByText(/^Opened Qty: 0$/)).toBeInTheDocument();
    expect(screen.getByText(/^Unopened Qty: 0$/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('2023-06-02'));
    expect(screen.getByText(/Total Qty: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/^Opened Qty: 0$/)).toBeInTheDocument();
    expect(screen.getByText(/^Unopened Qty: 1$/)).toBeInTheDocument();
  });
});
