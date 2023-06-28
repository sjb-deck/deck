import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import ItemPotentialMatchDialog from '../../../components/AddItems/ItemPotentialMatchDialog';

describe('ItemPotentialMatchDialog', () => {
  test('renders with correct match and buttons', () => {
    const onCloseMock = jest.fn();
    const setActiveStepMock = jest.fn();
    const match = 'Example Match';

    render(
      <ItemPotentialMatchDialog
        open={true}
        onClose={onCloseMock}
        match={match}
        setActiveStep={setActiveStepMock}
      />,
    );

    const dialogTitle = screen.getByText('Warning!');
    const matchContent = screen.getByText(`Example Match`);
    const mistakeButton = screen.getByText('That might be a mistake');
    const correctButton = screen.getByText('The item is correct');

    expect(dialogTitle).toBeInTheDocument();
    expect(matchContent).toBeInTheDocument();
    expect(mistakeButton).toBeInTheDocument();
    expect(correctButton).toBeInTheDocument();
  });

  test('calls setActiveStep and onClose when "That might be a mistake" button is clicked', () => {
    const onCloseMock = jest.fn();
    const setActiveStepMock = jest.fn();
    const match = 'Example Match';

    render(
      <ItemPotentialMatchDialog
        open={true}
        onClose={onCloseMock}
        match={match}
        setActiveStep={setActiveStepMock}
      />,
    );

    const mistakeButton = screen.getByText('That might be a mistake');

    fireEvent.click(mistakeButton);

    expect(setActiveStepMock).toHaveBeenCalledTimes(1);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when "The item is correct" button is clicked', () => {
    const onCloseMock = jest.fn();
    const setActiveStepMock = jest.fn();
    const match = 'Example Match';

    render(
      <ItemPotentialMatchDialog
        open={true}
        onClose={onCloseMock}
        match={match}
        setActiveStep={setActiveStepMock}
      />,
    );

    const correctButton = screen.getByText('The item is correct');

    fireEvent.click(correctButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
