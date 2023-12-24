import { fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import { KitIndex } from '../../../pages';
import { render } from '../../../testSetup';
describe('KitIndex Search', () => {
  it('should filter by blueprint name', async () => {
    render(<KitIndex />);
    await waitFor(() => {
      expect(screen.getAllByText('Ready')[0]).toBeInTheDocument();
    });
    const searchInput = screen.getByLabelText('Search by Blueprint');
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'tEst bLuepri' } });
    expect(screen.getByTestId('kit-30')).toBeInTheDocument();
    expect(screen.queryByTestId('kit-31')).not.toBeInTheDocument();
    expect(screen.queryByTestId('kit-32')).not.toBeInTheDocument();
  });

  it('should filter by complete status', async () => {
    render(<KitIndex />);
    await waitFor(() => {
      expect(screen.getAllByText('Ready')[0]).toBeInTheDocument();
    });
    const selectInput = screen.getByTestId('kit-select');
    expect(selectInput).toBeInTheDocument();

    fireEvent.change(selectInput, { target: { value: 'complete' } });
    expect(screen.getByTestId('kit-30')).toBeInTheDocument();
    expect(screen.getByTestId('kit-31')).toBeInTheDocument();
    expect(screen.queryByTestId('kit-32')).not.toBeInTheDocument();

    fireEvent.change(selectInput, { target: { value: 'incomplete' } });
    expect(screen.getByTestId('kit-32')).toBeInTheDocument();
    expect(screen.queryByTestId('kit-30')).not.toBeInTheDocument();
    expect(screen.queryByTestId('kit-31')).not.toBeInTheDocument();

    fireEvent.change(selectInput, { target: { value: 'all' } });
    expect(screen.getByTestId('kit-30')).toBeInTheDocument();
    expect(screen.getByTestId('kit-31')).toBeInTheDocument();
    expect(screen.getByTestId('kit-32')).toBeInTheDocument();
  });
});
