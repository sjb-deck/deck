import { fireEvent, render, screen } from '@testing-library/react';
import axios from 'axios';
import React from 'react';
import { act } from 'react-dom/test-utils';

import '@testing-library/jest-dom';
import ItemIndex from '../../../pages/inventory/itemIndex';

const mockProperties = {
  unit: 'Roll',
  imgpic: null,
  total_quantityopen: 9,
  total_quantityunopened: 8,
  min_quantityopen: 0,
  min_quantityunopened: 0,
  expirydates: [
    {
      id: 44,
      expirydate: '2023-07-29',
      quantityopen: 9,
      quantityunopened: 8,
      archived: false,
      item: 70,
    },
  ],
};
const mockItems = [
  {
    id: 70,
    name: 'Triangular',
    type: 'Bandages',
    ...mockProperties,
  },
  {
    id: 71,
    name: 'Compression',
    type: 'Bandages',
    ...mockProperties,
  },
  {
    id: 72,
    name: 'Scissors',
    type: 'General',
    ...mockProperties,
  },
  {
    id: 73,
    name: 'Gauze',
    type: 'General',
    ...mockProperties,
  },
  {
    id: 74,
    name: 'Saline',
    type: 'Solution',
    ...mockProperties,
  },
  {
    id: 75,
    name: 'Alcohol',
    type: 'Solution',
    ...mockProperties,
  },
];

jest.mock('axios');

beforeEach(() => {
  axios.get.mockImplementationOnce(() =>
    Promise.resolve({
      data: mockItems,
    }),
  );
});

describe('ItemIndex Search Filtering', () => {
  test('renders the ItemIndex page with all mock items', async () => {
    await act(async () => {
      render(<ItemIndex />);
    });
    const itemsArray = [
      'Triangular',
      'Compression',
      'Saline',
      'Scissors',
      'Gauze',
    ];

    const searchInput = screen.getByLabelText('Search');
    expect(searchInput).toBeInTheDocument();
    itemsArray.forEach((item) => {
      const element = screen.getByText(item);
      expect(element).toBeInTheDocument();
    });
  });

  test('filter works with default ALL selected', async () => {
    await act(async () => {
      render(<ItemIndex />);
    });
    const inputField = screen.getByLabelText('Search');
    expect(inputField).toBeInTheDocument();
    fireEvent.change(inputField, { target: { value: 'Compress' } });

    const compression = screen.getAllByText('Compression')[0];
    const triangular = screen.queryByText('Triangular');
    expect(compression).toBeInTheDocument();
    expect(triangular).not.toBeInTheDocument();
  });

  test('filter works with Solution selected', async () => {
    await act(async () => {
      render(<ItemIndex />);
    });
    const solutionButton = screen.getByText('Solution');
    fireEvent.click(solutionButton);
    expect(solutionButton).toHaveStyle('color: rgb(255, 255, 255)');

    const inputField = screen.getByLabelText('Search');
    expect(inputField).toBeInTheDocument();
    fireEvent.change(inputField, { target: { value: 'Alcoh' } });

    const alcohol = screen.getAllByText('Alcohol')[0];
    const saline = screen.queryByText('Saline');
    const compression = screen.queryByText('Compression');
    expect(alcohol).toBeInTheDocument();
    expect(saline).not.toBeInTheDocument();
    expect(compression).not.toBeInTheDocument();
  });

  test('filter works with General and Bandages selected', async () => {
    await act(async () => {
      render(<ItemIndex />);
    });
    const generalButton = screen.getByText('General');
    const bandagesButton = screen.getByText('Bandages');
    fireEvent.click(generalButton);
    fireEvent.click(bandagesButton);
    expect(generalButton).toHaveStyle('color: rgb(255, 255, 255)');
    expect(bandagesButton).toHaveStyle('color: rgb(255, 255, 255)');

    const inputField = screen.getByLabelText('Search');
    expect(inputField).toBeInTheDocument();
    fireEvent.change(inputField, { target: { value: 'Sci' } });

    const scissors = screen.getAllByText('Scissors')[0];
    const saline = screen.queryByText('Saline');
    const alcohol = screen.queryByText('Alcohol');
    expect(scissors).toBeInTheDocument();
    expect(saline).not.toBeInTheDocument();
    expect(alcohol).not.toBeInTheDocument();

    fireEvent.change(inputField, { target: { value: 'Tri' } });
    const triangular = screen.getAllByText('Triangular')[0];
    const gauze = screen.queryByText('Gauze');
    const scissors2 = screen.queryByText('Scissors');
    expect(triangular).toBeInTheDocument();
    expect(scissors2).not.toBeInTheDocument();
    expect(gauze).not.toBeInTheDocument();
  });
});
