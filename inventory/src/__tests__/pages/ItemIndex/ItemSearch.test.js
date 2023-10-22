import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';

import { ItemIndex } from '../../../pages';
import { render } from '../../../testSetup';

// TODO: Skipped as items is not being updated after fetching from useItems
xdescribe('ItemIndex Search Filtering', () => {
  test('renders the ItemIndex page with all mock items', async () => {
    render(<ItemIndex />);

    await waitFor(() => {});

    const itemsArray = [
      'Triangular',
      'Compression',
      'Saline',
      'Scissors',
      'Gauze',
    ];

    const searchInput = screen.getByLabelText('Search');
    expect(searchInput).toBeInTheDocument();
    // console.log(prettyDOM(container, 999999999));
    for (const item of itemsArray) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
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
