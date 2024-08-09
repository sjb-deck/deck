import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ItemList } from '../../../pages';
import { render } from '../../../testSetup';

describe.todo('Item Table', () => {
  it('should export', async () => {
    render(<ItemList />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Import' }));
    });

    const mLink = {
      href: '',
      click: vi.fn(),
      download: '',
      style: { display: '' },
      setAttribute: vi.fn(),
    };

    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockReturnValueOnce(mLink);
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();
    window.URL.createObjectURL = vi.fn();
    window.URL.revokeObjectURL = vi.fn();

    const exportButton = screen.getByRole('button', { name: 'Export' });
    expect(exportButton).toBeInTheDocument();

    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(mLink.setAttribute.mock.calls.length).toBe(2);
      expect(createElementSpy).toBeCalledWith('a');
      expect(mLink.setAttribute.mock.calls[1]).toEqual([
        'download',
        'items.csv',
      ]);
      expect(mLink.click).toBeCalled();
    });
  });
});
