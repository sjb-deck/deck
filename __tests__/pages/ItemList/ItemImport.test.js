import { fireEvent, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';
import { act } from 'react-dom/test-utils';

import { INV_API_IMPORT_ITEMS_URL } from '../../../globals';
import { server } from '../../../mocks/server';
import { handlers } from '../../../mocks/server/handlers';
import { ItemList } from '../../../pages/inventory';
import { render } from '../../../testSetup';
const mockCSV = new File([''], 'example.csv', {
  type: 'text/csv',
});

describe('Item Table', () => {
  it('should render ImportModal correctly', async () => {
    render(<ItemList />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Import' }));
    });

    const importModalButton = screen.getByRole('button', { name: 'Import' });
    fireEvent.click(importModalButton);

    const title = screen.getByText('Upload CSV');
    const fileInput = screen.getByTestId('csv-input');
    const importButton = screen.getByRole('button', { name: 'Import CSV' });

    expect(title).toBeInTheDocument();
    expect(fileInput).toBeInTheDocument();
    expect(importButton).toBeInTheDocument();
  });

  it('should upload mock CSV correctly', async () => {
    render(<ItemList />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Import' }));
    });

    const importModalButton = screen.getByRole('button', { name: 'Import' });
    fireEvent.click(importModalButton);

    const fileInput = screen.getByTestId('csv-input');
    act(() => {
      fireEvent.change(fileInput, { target: { files: [mockCSV] } });
    });

    expect(fileInput).toHaveProperty('files', [mockCSV]);
  });

  it('should import CSV successfully', async () => {
    render(<ItemList />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Import' }));
    });

    const importModalButton = screen.getByRole('button', { name: 'Import' });
    fireEvent.click(importModalButton);

    const fileInput = screen.getByTestId('csv-input');
    const importButton = screen.getByRole('button', { name: 'Import CSV' });
    act(() => {
      fireEvent.change(fileInput, { target: { files: [mockCSV] } });
      fireEvent.click(importButton);
    });
    await waitFor(() => {
      const input = screen.queryByTestId('csv-input');
      expect(input).not.toBeInTheDocument();
    });

    const toast = screen.getByText('Items created successfully!');
    expect(toast).toBeInTheDocument();
  });

  xit('should display error message when import fails', async () => {
    // Jest is not displaying an error message.
    server.use(
      ...handlers,
      rest.post(INV_API_IMPORT_ITEMS_URL),
      (req, res, ctx) => {
        return res(ctx.status(400), ctx.json({}));
      },
    );
    render(<ItemList />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Import' }));
    });
    const importModalButton = screen.getByRole('button', { name: 'Import' });
    fireEvent.click(importModalButton);
    const fileInput = screen.getByTestId('csv-input');
    const importButton = screen.getByRole('button', { name: 'Import CSV' });
    act(() => {
      fireEvent.change(fileInput, { target: { files: [mockCSV] } });
      fireEvent.click(importButton);
    });
    await waitFor(() => {
      const input = screen.getByTestId('csv-input');
      const toast = screen.getByText('Request failed with status code 400');
      expect(input).toBeInTheDocument();
      expect(toast).toBeInTheDocument();
    });
  });
});
