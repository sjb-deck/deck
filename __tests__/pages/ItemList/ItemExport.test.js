import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';

import { ItemList } from '../../../pages/inventory';
import { render } from '../../../testSetup';

describe('Item Table', () => {
  it('should export', async () => {
    render(<ItemList />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Import' }));
    });

    const mLink = {
      href: '',
      click: jest.fn(),
      download: '',
      style: { display: '' },
      setAttribute: jest.fn(),
    };

    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockReturnValueOnce(mLink);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
    window.URL.createObjectURL = jest.fn();
    window.URL.revokeObjectURL = jest.fn();

    const exportButton = screen.getByRole('button', { name: 'Export' });
    expect(exportButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(exportButton);
    });

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
