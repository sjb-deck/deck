import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { KitCreate } from '../../../components/KitAdd/KitCreate';
import { render, userEvent } from '../../../testSetup';

describe('Kit Add', () => {
  it('should render blueprint details on selection', async () => {
    render(<KitCreate />);
    await waitFor(() =>
      expect(screen.getAllByText('Create Kit')[0]).toBeInTheDocument(),
    );
    const blueprintForm = screen.getByTestId('blueprint-form');
    await userEvent.click(within(blueprintForm).getByRole('combobox'));
    await userEvent.click(
      screen.getByRole('option', {
        name: 'printblue',
      }),
    );

    await waitFor(() => screen.getByText('test item'));
    const blueprintItemAccordion = screen.getByTestId('blueprint-5');

    const blueprintFormItems = [
      'ID:',
      'Expiry Date:',
      'Quantity:',
      'Required Quantity:',
      '46',
      '2023-09-06',
      '47',
      '2023-09-28',
      '/ 1',
      '/ 7',
    ];
    for (const formItem of blueprintFormItems) {
      const formElement = within(blueprintItemAccordion).getAllByText(
        formItem,
      )[0];
      expect(formElement).toBeInTheDocument();
    }
  });

  it('should restrict form submission when validation fails', async () => {
    render(<KitCreate />);
    await waitFor(() =>
      expect(screen.getAllByText('Create Kit')[0]).toBeInTheDocument(),
    );
    const blueprintForm = screen.getByTestId('blueprint-form');
    const button = within(blueprintForm).getByRole('combobox');
    await userEvent.click(button);
    const option = screen.getByRole('option', {
      name: 'printblue',
    });
    await userEvent.click(option);
    await waitFor(() => screen.getByText('test item'));

    const blueprintSelect = screen.getByTestId('blueprint-select');
    expect(blueprintSelect).toHaveValue('10');

    const nameInput = screen.getByLabelText('Kit Name');
    fireEvent.change(nameInput, { target: { value: 'hello' } });
    expect(nameInput).toHaveValue('hello');

    const itemContainer1 = screen.getByTestId('blueprint-item-1');
    const itemContainer2 = screen.getByTestId('blueprint-item-5');
    const itemContainer3 = screen.getByTestId('blueprint-item-10');

    const itemExpiryContainer1 = screen.getByTestId('blueprint-itemExpiry-1');
    const itemExpiryContainer2 = screen.getByTestId('blueprint-itemExpiry-46');
    const itemExpiryContainer3 = screen.getByTestId('blueprint-itemExpiry-47');
    const itemExpiryContainer4 = screen.getByTestId('blueprint-itemExpiry-52');

    const itemExpiryQty1 = screen.getByTestId('blueprint-qty-1-1');
    const itemExpiryQty2 = screen.getByTestId('blueprint-qty-5-46');
    const itemExpiryQty3 = screen.getByTestId('blueprint-qty-5-47');
    const itemExpiryQty4 = screen.getByTestId('blueprint-qty-10-52');

    const requiredQty1 = screen.getByTestId('blueprint-required-1');
    const requiredQty2 = screen.getByTestId('blueprint-required-5');
    const requiredQty3 = screen.getByTestId('blueprint-required-10');

    fireEvent.change(itemExpiryQty1, { target: { value: 2 } });
    fireEvent.change(itemExpiryQty2, { target: { value: 1 } });
    fireEvent.change(itemExpiryQty3, { target: { value: 8 } });
    fireEvent.change(itemExpiryQty4, { target: { value: 22 } });

    fireEvent.change(nameInput, { target: { value: '' } });

    expect(itemExpiryQty1).toHaveValue('2');
    expect(itemExpiryQty2).toHaveValue('1');
    expect(itemExpiryQty3).toHaveValue('8');
    expect(itemExpiryQty4).toHaveValue('22');

    expect(requiredQty1).toHaveValue('2');
    expect(requiredQty2).toHaveValue('9');
    expect(requiredQty3).toHaveValue('22');

    const submitBtn = screen.getByTestId('blueprint-submit-btn');
    await userEvent.click(submitBtn);

    expect(await screen.findByText('Name cannot be empty')).toBeInTheDocument();

    expect(
      within(itemExpiryContainer1).queryByText('Insufficient quantity'),
    ).toBeNull();
    expect(
      within(itemExpiryContainer2).queryByText('Insufficient quantity'),
    ).toBeNull();
    expect(
      await within(itemExpiryContainer3).findByText('Insufficient quantity'),
    ).toBeInTheDocument();
    expect(
      within(itemExpiryContainer4).queryByText('Insufficient quantity'),
    ).toBeNull();

    expect(
      within(itemContainer1).queryByText('Required quantity exceeded'),
    ).toBeNull();
    expect(
      await within(itemContainer2).findByText('Required quantity exceeded'),
    ).toBeInTheDocument();
    expect(
      await within(itemContainer3).findByText('Required quantity exceeded'),
    ).toBeInTheDocument();
  });
  it('should display correct message when kit creation succeeds', async () => {
    render(<KitCreate />);
    await waitFor(() =>
      expect(screen.getAllByText('Create Kit')[0]).toBeInTheDocument(),
    );
    const blueprintForm = screen.getByTestId('blueprint-form');
    const button = within(blueprintForm).getByRole('combobox');
    await userEvent.click(button);
    const option = screen.getByRole('option', {
      name: 'printblue',
    });
    await userEvent.click(option);
    await waitFor(() => screen.getByText('test item'));

    const blueprintSelect = screen.getByTestId('blueprint-select');
    expect(blueprintSelect).toHaveValue('10');

    const nameInput = screen.getByLabelText('Kit Name');
    fireEvent.change(nameInput, { target: { value: 'hello' } });

    const itemExpiryQty1 = screen.getByTestId('blueprint-qty-1-1');
    const itemExpiryQty2 = screen.getByTestId('blueprint-qty-5-46');
    const itemExpiryQty3 = screen.getByTestId('blueprint-qty-5-47');
    const itemExpiryQty4 = screen.getByTestId('blueprint-qty-10-52');

    fireEvent.change(itemExpiryQty1, { target: { value: 2 } });
    fireEvent.change(itemExpiryQty2, { target: { value: 1 } });
    fireEvent.change(itemExpiryQty3, { target: { value: 1 } });
    fireEvent.change(itemExpiryQty4, { target: { value: 3 } });

    const submitBtn = screen.getByTestId('blueprint-submit-btn');
    await userEvent.click(submitBtn);

    expect(
      await screen.findByText('Successfully created kit!'),
    ).toBeInTheDocument();
  });
});
