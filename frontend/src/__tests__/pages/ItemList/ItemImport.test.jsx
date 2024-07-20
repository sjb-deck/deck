import { fireEvent, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { Api } from '../../../globals/api';
import { server } from '../../../mocks/server';
import { ItemList } from '../../../pages';
import { render } from '../../../testSetup';
const mockCSV = new File([''], 'example.csv', {
  type: 'text/csv',
});

describe.todo('Item Table', () => {
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

    fireEvent.change(fileInput, { target: { files: [mockCSV] } });

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

    fireEvent.change(fileInput, { target: { files: [mockCSV] } });
    fireEvent.click(importButton);

    await waitFor(() => {
      const input = screen.queryByTestId('csv-input');
      expect(input).not.toBeInTheDocument();
    });

    const toast = screen.getByText('Items created successfully!');
    expect(toast).toBeInTheDocument();
  });

  it('should display error message when import fails', async () => {
    // Jest is not displaying an error message.
    server.use(
      http.post(Api['importItems'], () => {
        return HttpResponse.error('Request failed with status code 400');
      }),
    );
    render(<ItemList />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Import' }));
    });
    const importModalButton = screen.getByRole('button', { name: 'Import' });
    fireEvent.click(importModalButton);
    const fileInput = screen.getByTestId('csv-input');
    const importButton = screen.getByRole('button', { name: 'Import CSV' });

    fireEvent.change(fileInput, { target: { files: [mockCSV] } });
    fireEvent.click(importButton);

    await waitFor(() => {
      const input = screen.getByTestId('csv-input');
      const toast = screen.getByText('Request failed with status code 400');
      expect(input).toBeInTheDocument();
      expect(toast).toBeInTheDocument();
    });
  });
});
