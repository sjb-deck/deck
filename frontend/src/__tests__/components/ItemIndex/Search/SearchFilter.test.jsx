import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SearchFilter } from '../../../../components';

describe('SearchFilter', () => {
  it('renders the filter buttons', () => {
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

  it('toggles individual filter buttons and that allButton is auto toggled', () => {
    const onFilterChange = vi.fn();
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

  it('deselects all other buttons when "All" button is clicked', () => {
    const onFilterChange = vi.fn();
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

    expect(generalButton).toHaveStyle('color: rgb(255, 255, 255)');
    expect(bandagesButton).toHaveStyle('color: rgb(255, 255, 255)');
    expect(solutionButton).toHaveStyle('color: rgb(255, 255, 255)');
    expect(dressingButton).toHaveStyle('color: rgb(255, 255, 255)');
    expect(universalPrecautionButton).toHaveStyle('color: rgb(255, 255, 255)');

    fireEvent.click(screen.getByText('All'));

    expect(onFilterChange).toHaveBeenCalledWith(['All']);
    expect(generalButton).toHaveStyle('color: rgb(25, 118, 210)');
    expect(bandagesButton).toHaveStyle('color: rgb(25, 118, 210)');
    expect(solutionButton).toHaveStyle('color: rgb(25, 118, 210)');
    expect(dressingButton).toHaveStyle('color: rgb(25, 118, 210)');
    expect(universalPrecautionButton).toHaveStyle('color: rgb(25, 118, 210)');
  });
});
