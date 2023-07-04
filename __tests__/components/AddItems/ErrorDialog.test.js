import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import ErrorDialog from '../../../components/AddItems/ErrorDialog';

describe('ErrorDialog', () => {
  test('renders with correct error message and close button', () => {
    const onCloseMock = jest.fn();
    const errorMessage =
      'An error occurred. Please inform Fabian Sir immediately and do not attempt to add anything else.';

    render(<ErrorDialog open={true} onClose={onCloseMock} />);

    const dialogTitle = screen.getByText('Error!');
    const dialogContent = screen.getByText(errorMessage);
    const closeButton = screen.getByText('Close');

    expect(dialogTitle).toBeInTheDocument();
    expect(dialogContent).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const onCloseMock = jest.fn();

    render(<ErrorDialog open={true} onClose={onCloseMock} />);

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
