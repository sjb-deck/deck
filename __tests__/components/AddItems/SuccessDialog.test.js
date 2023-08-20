import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import SuccessDialog from '../../../components/AddItems/SuccessDialog';

xdescribe('SuccessDialog', () => {
  test('renders with correct success message and close button', () => {
    const onCloseMock = jest.fn();
    const successMessage = 'Success message';

    render(
      <SuccessDialog
        open={true}
        onClose={onCloseMock}
        message={successMessage}
      />,
    );

    const dialogTitle = screen.getByText('Success!');
    const dialogContent = screen.getByText(successMessage);
    const closeButton = screen.getByText('Close');

    expect(dialogTitle).toBeInTheDocument();
    expect(dialogContent).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const onCloseMock = jest.fn();

    render(
      <SuccessDialog
        open={true}
        onClose={onCloseMock}
        message='Success message'
      />,
    );

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
