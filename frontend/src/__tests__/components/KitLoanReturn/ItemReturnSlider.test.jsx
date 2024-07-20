import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ItemReturnSlider } from '../../../components';
import { render, userEvent } from '../../../testSetup';

describe('ItemReturnSlider', () => {
  it('should render correctly', () => {
    const mockUpdate = vi.fn();
    render(<ItemReturnSlider originalQuantity={10} update={mockUpdate} />);

    const input = screen.getByRole('spinbutton');
    expect(input).toBeInTheDocument();
  });

  it('should handle input change', async () => {
    const mockUpdate = vi.fn();
    render(<ItemReturnSlider originalQuantity={10} update={mockUpdate} />);

    const input = screen.getByRole('spinbutton');
    await userEvent.clear(input);
    await userEvent.type(input, '5');
    input.blur();

    expect(input.value).toBe('5');
    expect(mockUpdate).toHaveBeenCalledWith(5);
  });

  it('should limit input value', async () => {
    const mockUpdate = vi.fn();
    render(<ItemReturnSlider originalQuantity={100} update={mockUpdate} />);

    const input = screen.getByRole('spinbutton');
    await userEvent.clear(input);
    await userEvent.type(input, '123');
    input.blur();

    expect(input.value).toBe('12');
  });
});
