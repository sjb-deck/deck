import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchFilter from './SearchFilter';

describe('SearchFilter', () => {
  test('renders the filter buttons', () => {
    render(<SearchFilter onFilterChange={() => {}} />);
    const allButton = screen.getByText('All');
    expect(allButton).toBeInTheDocument();

    const generalButton = screen.getByText('General');
    expect(generalButton).toBeInTheDocument();

    const bandagesButton = screen.getByText('Bandages');
    expect(bandagesButton).toBeInTheDocument();

    const solutionButton = screen.getByText('Solution');
    expect(solutionButton).toBeInTheDocument();

    const dressingButton = screen.getByText('Dressing');
    expect(dressingButton).toBeInTheDocument();

    const universalPrecautionButton = screen.getByText('Universal Precaution');
    expect(universalPrecautionButton).toBeInTheDocument();
  });

  test('toggles individual filter buttons and that allButton is auto toggled', () => {
    const onFilterChange = jest.fn();
    render(<SearchFilter onFilterChange={onFilterChange} />);
    const generalButton = screen.getByText('General');
    fireEvent.click(generalButton);
    expect(onFilterChange).toHaveBeenCalledWith(['General']);

    const bandagesButton = screen.getByText('Bandages');
    fireEvent.click(bandagesButton);
    expect(onFilterChange).toHaveBeenCalledWith(['General', 'Bandages']);

    fireEvent.click(generalButton);
    expect(onFilterChange).toHaveBeenCalledWith(['Bandages']);

    fireEvent.click(bandagesButton);
    expect(onFilterChange).toHaveBeenCalledWith(['All']);
  });

  test('deselects all other buttons when "All" button is clicked', () => {
    const onFilterChange = jest.fn();
    render(<SearchFilter onFilterChange={onFilterChange} />);

    const generalButton = screen.getByText('General');
    const bandagesButton = screen.getByText('Bandages');
    const solutionButton = screen.getByText('Solution');
    const dressingButton = screen.getByText('Dressing');
    const universalPrecautionButton = screen.getByText('Universal Precaution');

    fireEvent.click(generalButton);
    fireEvent.click(bandagesButton);
    fireEvent.click(solutionButton);
    fireEvent.click(dressingButton);
    fireEvent.click(universalPrecautionButton);

    expect(generalButton).toHaveStyle('background: dimgrey');
    expect(bandagesButton).toHaveStyle('background: dimgrey');
    expect(solutionButton).toHaveStyle('background: dimgrey');
    expect(dressingButton).toHaveStyle('background: dimgrey');
    expect(universalPrecautionButton).toHaveStyle('background: dimgrey');

    fireEvent.click(screen.getByText('All'));

    expect(onFilterChange).toHaveBeenCalledWith(['All']);
    expect(generalButton).not.toHaveStyle('background: dimgrey');
    expect(bandagesButton).not.toHaveStyle('background: dimgrey');
    expect(solutionButton).not.toHaveStyle('background: dimgrey');
    expect(dressingButton).not.toHaveStyle('background: dimgrey');
    expect(universalPrecautionButton).not.toHaveStyle('background: dimgrey');
  });
});
