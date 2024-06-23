import { screen } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';

import { ConfirmationModal } from '../../../components';
import { Api } from '../../../globals';
import { server } from '../../../mocks';
import { render, userEvent } from '../../../testSetup';

describe('ConfirmationModal', () => {
  beforeEach(() => {
    server.use(
      rest.post(Api['returnKit'], (req, res, ctx) => {
        return res(ctx.status(200));
      }),
    );
  });
  it('should render correctly', () => {
    const mockCloseDialog = jest.fn();

    render(
      <ConfirmationModal
        kitId={1}
        data={[]}
        openConfirm={true}
        closeDialog={mockCloseDialog}
      />,
    );

    expect(screen.getByText('Confirm Loan Return')).toBeInTheDocument();
  });

  it('should render data correctly', () => {
    const mockCloseDialog = jest.fn();

    render(
      <ConfirmationModal
        kitId={1}
        data={[
          {
            id: 1,
            name: 'test',
            quantity: 2,
            newQuantity: 1,
            shown_quantity: 2,
            blueprintQuantity: 2,
            expiry_date: '2023-07-23',
          },
        ]}
        openConfirm={true}
        closeDialog={mockCloseDialog}
      />,
    );

    // check column headers
    expect(
      screen.getByRole('row', {
        name: 'ID Item Expiry Date Quantity Left Used',
      }),
    ).toBeInTheDocument();

    // check data
    expect(
      screen.getByRole('row', { name: '0 test 2023-07-23 2 1 1' }),
    ).toBeInTheDocument();
  });

  it('should handle submit', async () => {
    const mockCloseDialog = jest.fn();
    const mockMutate = jest.fn();
    server.use(
      rest.post(Api['returnKit'], (req, res, ctx) => {
        mockMutate();
        return res(ctx.status(200));
      }),
    );

    render(
      <ConfirmationModal
        kitId={1}
        data={[
          {
            id: 1,
            name: 'test',
            quantity: 2,
            newQuantity: 1,
            shown_quantity: 2,
            blueprintQuantity: 2,
            expiry_date: '2023-07-23',
          },
        ]}
        openConfirm={true}
        closeDialog={mockCloseDialog}
      />,
    );

    await userEvent.click(screen.getByText('Confirm'));

    expect(mockMutate).toHaveBeenCalled();
    expect(mockCloseDialog).toHaveBeenCalled();
  });

  it('should handle cancel', async () => {
    const mockCloseDialog = jest.fn();
    const mockMutate = jest.fn();
    server.use(
      rest.post(Api['returnKit'], (req, res, ctx) => {
        mockMutate();
        return res(ctx.status(200));
      }),
    );

    render(
      <ConfirmationModal
        kitId={1}
        data={[]}
        openConfirm={true}
        closeDialog={mockCloseDialog}
      />,
    );

    await userEvent.click(screen.getByText('Cancel'));
    expect(mockCloseDialog).toHaveBeenCalled();
    expect(mockMutate).not.toHaveBeenCalled();
  });
});
