import { screen, within } from '@testing-library/react';
import React from 'react';

import { KitRestockOptionAccordion } from '../../../components/KitRestock/KitRestockOptionAccordion';
import { exampleKitRestockOptions } from '../../../mocks';
import { render, userEvent } from '../../../testSetup';
import { getReadableDate } from '../../../utils';

describe('KitRestockOptionAccordion', () => {
  const restockOption = exampleKitRestockOptions[0];
  const restockValues = restockOption.item_options.map((option) => {
    return { item_expiry_id: option.item_expiry_id, quantity: 0 };
  });
  const setRestockValues = jest.fn();
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders correctly', () => {
    render(
      <KitRestockOptionAccordion
        item={restockOption}
        restockValues={restockValues}
        setRestockValues={jest.fn()}
        error={{}}
      />,
    );

    // check that the accordion summary is rendered
    const accordion = screen.getByRole('button', {
      name: `${restockOption.item_name} ${restockOption.current_quantity} / ${restockOption.required_quantity}`,
    });
    expect(accordion).toBeInTheDocument();
    expect(accordion).toHaveAttribute('aria-expanded', 'true');

    // check that the options are rendered
    for (const option of restockOption.item_options) {
      const optionContainer = screen.getByRole('restockOption', {
        name: `Restock from ${option.item_expiry_id}`,
      });
      expect(optionContainer).toBeInTheDocument();
      // check that total quantity is rendered
      expect(within(optionContainer).getByText(`/ ${option.quantity}`));
      expect(within(optionContainer).getByRole('textbox')).toBeInTheDocument();
      expect(
        within(optionContainer).getByText(
          getReadableDate(option.expiry_date).formattedDate,
        ),
      ).toBeInTheDocument();
    }
  });

  it('calls setRestockValues on value change', async () => {
    render(
      <KitRestockOptionAccordion
        item={restockOption}
        restockValues={restockValues}
        setRestockValues={setRestockValues}
        error={{}}
      />,
    );

    // check that the total count is rendered
    const accordion = screen.getByRole('button', {
      name: `${restockOption.item_name} ${restockOption.current_quantity} / ${restockOption.required_quantity}`,
    });
    expect(
      within(accordion).getByText(
        `${restockOption.current_quantity} / ${restockOption.required_quantity}`,
      ),
    ).toBeInTheDocument();

    // add some values
    const optionContainer = screen.getByRole('restockOption', {
      name: `Restock from ${restockOption.item_options[0].item_expiry_id}`,
    });
    const input = within(optionContainer).getByRole('textbox');
    expect(setRestockValues).not.toHaveBeenCalled();
    await userEvent.type(input, '1');
    await userEvent.click(document.body);

    expect(setRestockValues).toHaveBeenCalledWith([
      {
        item_expiry_id: restockOption.item_options[0].item_expiry_id,
        quantity: 1,
      },
      ...restockValues.slice(1),
    ]);
    expect(setRestockValues).toHaveBeenCalledTimes(1);
  });

  it('correctly renders total quantity', () => {
    const { rerender } = render(
      <KitRestockOptionAccordion
        item={restockOption}
        restockValues={restockValues}
        setRestockValues={jest.fn()}
        error={{}}
      />,
    );

    // check that the total count is rendered
    const accordion = screen.getByRole('button', {
      name: `${restockOption.item_name} ${restockOption.current_quantity} / ${restockOption.required_quantity}`,
    });
    expect(
      within(accordion).getByText(
        `${restockOption.current_quantity} / ${restockOption.required_quantity}`,
      ),
    ).toBeInTheDocument();

    rerender(
      <KitRestockOptionAccordion
        item={restockOption}
        restockValues={[
          {
            item_expiry_id: restockOption.item_options[0].item_expiry_id,
            quantity: 1,
          },
          ...restockValues.slice(1),
        ]}
        setRestockValues={jest.fn()}
        error={{}}
      />,
    );

    expect(
      within(accordion).getByText(
        `${restockOption.current_quantity + 1} / ${
          restockOption.required_quantity
        }`,
      ),
    ).toBeInTheDocument();

    rerender(
      <KitRestockOptionAccordion
        item={restockOption}
        restockValues={[
          {
            item_expiry_id: restockOption.item_options[0].item_expiry_id,
            quantity: 1,
          },
          {
            item_expiry_id: restockOption.item_options[1].item_expiry_id,
            quantity: 2,
          },
          ...restockValues.slice(2),
        ]}
        setRestockValues={jest.fn()}
        error={{}}
      />,
    );

    expect(
      within(accordion).getByText(
        `${restockOption.current_quantity + 3} / ${
          restockOption.required_quantity
        }`,
      ),
    ).toBeInTheDocument();
  });

  it('renders error message', () => {
    const { rerender } = render(
      <KitRestockOptionAccordion
        item={restockOption}
        restockValues={restockValues}
        setRestockValues={jest.fn()}
        error={{}}
      />,
    );

    // check that the error message is not rendered
    const accordion = screen.getByRole('button', {
      name: `${restockOption.item_name} ${restockOption.current_quantity} / ${restockOption.required_quantity}`,
    });
    expect(
      within(accordion).queryByText('Quantity more than required'),
    ).not.toBeInTheDocument();

    rerender(
      <KitRestockOptionAccordion
        item={restockOption}
        restockValues={[
          {
            item_expiry_id: restockOption.item_options[0].item_expiry_id,
            quantity: 1,
          },
          ...restockValues.slice(1),
        ]}
        setRestockValues={jest.fn()}
        error={{
          item_id: restockOption.item_id,
          message: 'Quantity more than required',
        }}
      />,
    );

    expect(
      within(accordion).getByText('Quantity more than required'),
    ).toBeInTheDocument();
  });

  describe('input validation', () => {
    it('does not allow negative numbers', async () => {
      render(
        <KitRestockOptionAccordion
          item={restockOption}
          restockValues={restockValues}
          setRestockValues={setRestockValues}
          error={{}}
        />,
      );

      // add some values
      const optionContainer = screen.getByRole('restockOption', {
        name: `Restock from ${restockOption.item_options[0].item_expiry_id}`,
      });
      const input = within(optionContainer).getByRole('textbox');
      expect(setRestockValues).not.toHaveBeenCalled();
      await userEvent.type(input, '-1');
      await userEvent.click(document.body);
      const optionContainerAfter = screen.getByRole('restockOption', {
        name: `Restock from ${restockOption.item_options[0].item_expiry_id}`,
      });
      const inputAfter = within(optionContainerAfter).getByRole('textbox');
      expect(inputAfter).toHaveValue('0');
      expect(setRestockValues).toHaveBeenCalledWith(restockValues);
      expect(setRestockValues).toHaveBeenCalledTimes(1);
    });
    it('does not allow numbers > available quantity', async () => {
      render(
        <KitRestockOptionAccordion
          item={restockOption}
          restockValues={restockValues}
          setRestockValues={setRestockValues}
          error={{}}
        />,
      );

      // add some values
      const optionContainer = screen.getByRole('restockOption', {
        name: `Restock from ${restockOption.item_options[0].item_expiry_id}`,
      });
      const input = within(optionContainer).getByRole('textbox');
      expect(setRestockValues).not.toHaveBeenCalled();
      await userEvent.type(
        input,
        (restockOption.item_options[0].quantity + 1).toString(),
      );
      await userEvent.click(document.body);
      const optionContainerAfter = screen.getByRole('restockOption', {
        name: `Restock from ${restockOption.item_options[0].item_expiry_id}`,
      });
      const inputAfter = within(optionContainerAfter).getByRole('textbox');
      expect(inputAfter).toHaveValue(
        restockOption.item_options[0].quantity.toString(),
      );
      expect(setRestockValues).toHaveBeenCalledWith([
        {
          item_expiry_id: restockOption.item_options[0].item_expiry_id,
          quantity: restockOption.item_options[0].quantity,
        },
        ...restockValues.slice(1),
      ]);
      expect(setRestockValues).toHaveBeenCalledTimes(1);
    });
  });
});
