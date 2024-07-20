import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { KitRestockContent } from '../../../components';
import { Api } from '../../../globals/api';
import { exampleKit, exampleKitRestockOptions, server } from '../../../mocks';
import { render, userEvent } from '../../../testSetup';

describe('<KitRestockContent />', () => {
  it('Renders correctly', async () => {
    const exampleRestockKit = {
      ...exampleKit,
      status: 'READY',
      complete: 'incomplete',
    };
    render(<KitRestockContent kit={exampleRestockKit} />);

    await waitForElementToBeRemoved(() =>
      screen.getByTestId('loading-spinner'),
    );

    // check that info is correctly rendered
    expect(screen.getByText(exampleRestockKit.name)).toBeInTheDocument();
    expect(
      screen.getByText(exampleRestockKit.blueprint_name),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${exampleRestockKit.status}, ${exampleRestockKit.complete}`,
      ),
    ).toBeInTheDocument();

    // check that table is correctly rendered
    for (const item of exampleKitRestockOptions) {
      const accordion = screen.getByRole('button', {
        name: `${item.item_name} ${item.current_quantity} / ${item.required_quantity}`,
      });
      expect(accordion).toBeInTheDocument();
      // check that it is default expanded
      expect(accordion).toHaveAttribute('aria-expanded', 'true');
      // check that the options are rendered correctly
      for (const option of item.item_options) {
        const optionContainer = screen.getByRole('restockOption', {
          name: `Restock from ${option.item_expiry_id}`,
        });
        expect(optionContainer).toBeInTheDocument();
        const optionField = within(optionContainer).getByRole('textbox');
        expect(optionField).toBeInTheDocument();
        expect(optionField).toHaveAttribute(
          'aria-valuemax',
          option.quantity.toString(),
        );
      }
    }

    // check that the submit button is rendered correctly
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  describe('Submit button is ', () => {
    it('disabled when no restock action', async () => {
      const exampleRestockKit = {
        ...exampleKit,
        status: 'READY',
        complete: 'incomplete',
      };
      render(<KitRestockContent kit={exampleRestockKit} />);

      // check that the submit button is disabled
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });
    it('enabled when there is restock action', async () => {
      const exampleRestockKit = {
        ...exampleKit,
        status: 'READY',
        complete: 'incomplete',
      };
      render(<KitRestockContent kit={exampleRestockKit} />);

      // check that the submit button is disabled
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();

      // restock
      const optionContainer = screen.getByRole('restockOption', {
        name: `Restock from ${exampleKitRestockOptions[0].item_options[0].item_expiry_id}`,
      });
      const optionField = within(optionContainer).getByRole('textbox');
      await userEvent.type(optionField, '1');
      await userEvent.click(document.body); // move the focus away

      // check that the submit button is enabled
      expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
    });

    it('disabled when quantity is more than required', async () => {
      const exampleRestockKit = {
        ...exampleKit,
        status: 'READY',
        complete: 'incomplete',
      };
      render(<KitRestockContent kit={exampleRestockKit} />);

      // check that the submit button is disabled
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();

      // restock
      const optionContainer = screen.getByRole('restockOption', {
        name: `Restock from ${exampleKitRestockOptions[0].item_options[0].item_expiry_id}`,
      });
      const optionField = within(optionContainer).getByRole('textbox');
      await userEvent.type(
        optionField,
        (exampleKitRestockOptions[0].required_quantity + 1).toString(),
      );

      // check that the submit button is disabled
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });
  });

  describe('Shows error when ', () => {
    it('quantity is more than required', async () => {
      const exampleRestockKit = {
        ...exampleKit,
        status: 'READY',
        complete: 'incomplete',
      };
      render(<KitRestockContent kit={exampleRestockKit} />);

      // restock
      const optionContainer = screen.getByRole('restockOption', {
        name: `Restock from ${exampleKitRestockOptions[0].item_options[0].item_expiry_id}`,
      });
      const optionField = within(optionContainer).getByRole('textbox');
      await userEvent.type(
        optionField,
        (exampleKitRestockOptions[0].missing_quantity + 1).toString(),
      );
      await userEvent.click(document.body); // move the focus away

      // check that the error is shown
      expect(
        screen.getByText('Quantity more than required'),
      ).toBeInTheDocument();
    });
  });

  describe('Calls API correctly on submit', () => {
    it('when one item, one option is used', async () => {
      let lastRequest = null;
      server.use(
        http.post(Api['kitRestock'], ({ request }) => {
          lastRequest = request;
          return new HttpResponse(null, { status: 200 });
        }),
      );
      const exampleRestockKit = {
        ...exampleKit,
        status: 'READY',
        complete: 'incomplete',
      };
      render(<KitRestockContent kit={exampleRestockKit} />);

      // restock
      const optionContainer = screen.getByRole('restockOption', {
        name: `Restock from ${exampleKitRestockOptions[0].item_options[0].item_expiry_id}`,
      });
      const optionField = within(optionContainer).getByRole('textbox');
      await userEvent.type(optionField, '1');
      await userEvent.click(document.body); // move the focus away

      // submit
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

      // check that the API is called correctly
      await waitFor(() => expect(lastRequest).not.toBeNull());
      expect(new URL(lastRequest.url).pathname).toBe(Api['kitRestock']);
      expect(lastRequest.method).toBe('POST');
      expect(await lastRequest.json()).toEqual({
        kit_id: exampleRestockKit.id,
        content: [
          {
            item_expiry_id:
              exampleKitRestockOptions[0].item_options[0].item_expiry_id,
            quantity: 1,
          },
        ],
      });
    });
    it('when one item, multiple options are used', async () => {
      let lastRequest = null;
      server.use(
        http.post(Api['kitRestock'], ({ request }) => {
          lastRequest = request;
          return new HttpResponse(null, { status: 200 });
        }),
      );
      const exampleRestockKit = {
        ...exampleKit,
        status: 'READY',
        complete: 'incomplete',
      };
      render(<KitRestockContent kit={exampleRestockKit} />);

      // restock
      const optionContainer = screen.getByRole('restockOption', {
        name: `Restock from ${exampleKitRestockOptions[0].item_options[0].item_expiry_id}`,
      });
      const optionField = within(optionContainer).getByRole('textbox');
      await userEvent.type(optionField, '1');
      await userEvent.click(document.body); // move the focus away

      const optionContainer2 = screen.getByRole('restockOption', {
        name: `Restock from ${exampleKitRestockOptions[0].item_options[1].item_expiry_id}`,
      });
      const optionField2 = within(optionContainer2).getByRole('textbox');
      await userEvent.type(optionField2, '2');
      await userEvent.click(document.body); // move the focus away

      // submit
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

      // check that the API is called correctly
      await waitFor(() => expect(lastRequest).not.toBeNull());
      expect(new URL(lastRequest.url).pathname).toBe(Api['kitRestock']);
      expect(lastRequest.method).toBe('POST');
      expect(await lastRequest.json()).toEqual({
        kit_id: exampleRestockKit.id,
        content: [
          {
            item_expiry_id:
              exampleKitRestockOptions[0].item_options[0].item_expiry_id,
            quantity: 1,
          },
          {
            item_expiry_id:
              exampleKitRestockOptions[0].item_options[1].item_expiry_id,
            quantity: 2,
          },
        ],
      });
    });
    it('when multiple items, multiple options are used', async () => {
      let lastRequest = null;
      server.use(
        http.post(Api['kitRestock'], ({ request }) => {
          lastRequest = request;
          return new HttpResponse(null, { status: 200 });
        }),
      );
      const exampleRestockKit = {
        ...exampleKit,
        status: 'READY',
        complete: 'incomplete',
      };
      render(<KitRestockContent kit={exampleRestockKit} />);

      // restock
      const optionContainer = screen.getByRole('restockOption', {
        name: `Restock from ${exampleKitRestockOptions[0].item_options[0].item_expiry_id}`,
      });
      const optionField = within(optionContainer).getByRole('textbox');
      await userEvent.type(optionField, '1');
      await userEvent.click(document.body); // move the focus away

      const optionContainer2 = screen.getByRole('restockOption', {
        name: `Restock from ${exampleKitRestockOptions[0].item_options[1].item_expiry_id}`,
      });
      const optionField2 = within(optionContainer2).getByRole('textbox');
      await userEvent.type(optionField2, '2');
      await userEvent.click(document.body); // move the focus away

      const optionContainer3 = screen.getByRole('restockOption', {
        name: `Restock from ${exampleKitRestockOptions[1].item_options[0].item_expiry_id}`,
      });
      const optionField3 = within(optionContainer3).getByRole('textbox');
      await userEvent.type(optionField3, '1');
      await userEvent.click(document.body); // move the focus away

      const optionContainer4 = screen.getByRole('restockOption', {
        name: `Restock from ${exampleKitRestockOptions[1].item_options[1].item_expiry_id}`,
      });
      const optionField4 = within(optionContainer4).getByRole('textbox');
      await userEvent.type(optionField4, '1');
      await userEvent.click(document.body); // move the focus away

      // submit
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

      // check that the API is called correctly
      await waitFor(() => expect(lastRequest).not.toBeNull());
      expect(new URL(lastRequest.url).pathname).toBe(Api['kitRestock']);
      expect(lastRequest.method).toBe('POST');
      expect(await lastRequest.json()).toEqual({
        kit_id: exampleRestockKit.id,
        content: [
          {
            item_expiry_id:
              exampleKitRestockOptions[0].item_options[0].item_expiry_id,
            quantity: 1,
          },
          {
            item_expiry_id:
              exampleKitRestockOptions[0].item_options[1].item_expiry_id,
            quantity: 2,
          },
          {
            item_expiry_id:
              exampleKitRestockOptions[1].item_options[0].item_expiry_id,
            quantity: 1,
          },
          {
            item_expiry_id:
              exampleKitRestockOptions[1].item_options[1].item_expiry_id,
            quantity: 1,
          },
        ],
      });
    });
  });
  it('updates the values correctly on change', async () => {
    const exampleRestockKit = {
      ...exampleKit,
      status: 'READY',
      complete: 'incomplete',
    };
    render(<KitRestockContent kit={exampleRestockKit} />);

    // restock
    const optionContainer = screen.getByRole('restockOption', {
      name: `Restock from ${exampleKitRestockOptions[0].item_options[0].item_expiry_id}`,
    });
    const optionField = within(optionContainer).getByRole('textbox');
    expect(optionField).toHaveValue('0');
    await userEvent.type(optionField, '1');
    await userEvent.click(document.body);
    expect(within(optionContainer).getByRole('textbox')).toHaveValue('1');
    expect(screen.getByText('1 / 4')).toBeInTheDocument();

    // restock more
    const optionContainer2 = screen.getByRole('restockOption', {
      name: `Restock from ${exampleKitRestockOptions[0].item_options[1].item_expiry_id}`,
    });
    const optionField2 = within(optionContainer2).getByRole('textbox');
    expect(optionField2).toHaveValue('0');
    await userEvent.type(optionField2, '2');
    await userEvent.click(document.body);
    expect(within(optionContainer2).getByRole('textbox')).toHaveValue('2');
    expect(screen.getByText('3 / 4')).toBeInTheDocument();

    // remove some
    const optionContainerRemove = screen.getByRole('restockOption', {
      name: `Restock from ${exampleKitRestockOptions[0].item_options[0].item_expiry_id}`,
    });
    const optionFieldRemove = within(optionContainerRemove).getByRole(
      'textbox',
    );
    expect(optionFieldRemove).toHaveValue('1');
    await userEvent.type(optionFieldRemove, '{backspace}');
    await userEvent.click(document.body);
    expect(screen.getByText('2 / 4')).toBeInTheDocument();
  });
});
