import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import SearchBar from '../components/SearchBar';

const mockItems = [
  {
    id: 1,
    name: 'Item 1',
    type: 'Type 1',
    imgpic: 'image1.jpg',
    total_quantityopen: 10,
    total_quantityunopened: 5,
  },
  {
    id: 2,
    name: 'Item 2',
    type: 'Type 2',
    imgpic: 'image2.jpg',
    total_quantityopen: 7,
    total_quantityunopened: 3,
  },
];

describe('SearchBar', () => {
  test('renders the search bar component', () => {
    render(<SearchBar items={mockItems} selectedFilter={['All']} />);
    const searchInput = screen.getByLabelText('Search');
    expect(searchInput).toBeInTheDocument();
  });

  test('displays search results based on input', () => {
    render(<SearchBar items={mockItems} selectedFilter={['All']} />);
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'Item 1' } });
    const searchResult = screen.getByText('Item 1');
    expect(searchResult).toBeInTheDocument();
  });

  test('displays "No results found" when no matching items', () => {
    render(<SearchBar items={mockItems} selectedFilter={['All']} />);
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'Item 3' } });
    const noResultsText = screen.getByText('No results found.');
    expect(noResultsText).toBeInTheDocument();
  });

  test('filters results based on selected filter', () => {
    render(<SearchBar items={mockItems} selectedFilter={['Type 1']} />);
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'Item' } });
    const searchResult1 = screen.getByText('Item 1');
    expect(searchResult1).toBeInTheDocument();
    const searchResult2 = screen.queryByText('Item 2');
    expect(searchResult2).not.toBeInTheDocument();
  });
});
