import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SearchBar } from '../../../../components';
import { mockItems } from '../../../../mocks';
import { userEvent } from '../../../../testSetup';

describe.todo('SearchBar', () => {
  it('renders the search bar component', () => {
    render(<SearchBar items={mockItems} selectedFilter={['All']} />);
    const searchInput = screen.getByLabelText('Search...');
    expect(searchInput).toBeInTheDocument();
  });

  it('displays search results based on input', async () => {
    render(<SearchBar items={mockItems} selectedFilter={['All']} />);
    const searchInput = screen.getByLabelText('Search...');
    await userEvent.type(searchInput, 'G');
    const searchResult = screen.getByText('Gauze');
    expect(searchResult).toBeInTheDocument();
  });

  it('displays "No results found" when no matching items', () => {
    render(<SearchBar items={mockItems} selectedFilter={['All']} />);
    const searchInput = screen.getByLabelText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Item 3' } });
    const noResultsText = screen.getByText('No results found.');
    expect(noResultsText).toBeInTheDocument();
  });

  it('filters results based on selected filter', () => {
    render(<SearchBar items={mockItems} selectedFilter={['Solution']} />);
    const searchInput = screen.getByLabelText('Search...');
    fireEvent.change(searchInput, { target: { value: 'S' } });
    const searchResult1 = screen.getByText('Saline');
    expect(searchResult1).toBeInTheDocument();
    const searchResult2 = screen.queryByText('Scissors');
    expect(searchResult2).not.toBeInTheDocument();
  });
});
