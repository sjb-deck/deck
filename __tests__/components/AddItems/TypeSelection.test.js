import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import TypeSelection from '../../../components/AddItems/TypeSelection';

describe('TypeSelection', () => {
  test('renders with correct buttons and handles addType selection', () => {
    const addType = 'item';
    const handleAddTypeSelectionMock = jest.fn();

    render(
      <TypeSelection
        addType={addType}
        handleAddTypeSelection={handleAddTypeSelectionMock}
      />,
    );

    const noExpiryButton = screen.getByText('No Expiry');
    const hasExpiryButton = screen.getByText('Has Expiry');

    expect(noExpiryButton).toBeInTheDocument();
    expect(hasExpiryButton).toBeInTheDocument();

    expect(noExpiryButton).toHaveClass(
      addType === 'item' ? 'MuiButton-contained' : 'MuiButton-outlined',
    );
    expect(hasExpiryButton).toHaveClass(
      addType === 'expiry' ? 'MuiButton-contained' : 'MuiButton-outlined',
    );

    fireEvent.click(hasExpiryButton);
    expect(handleAddTypeSelectionMock).toHaveBeenCalledWith('expiry');

    fireEvent.click(noExpiryButton);
    expect(handleAddTypeSelectionMock).toHaveBeenCalledWith('item');
  });
});
