import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import AddItemForm from '../../../components/AddItems/AddItemForm';

xdescribe('AddItemForm', () => {
  const itemFormData = {
    name: '',
    type: '',
    unit: '',
    image: '',
    total_quantityopen: '',
    total_quantityunopened: '',
    min_quantityopen: '',
    min_quantityunopened: '',
  };

  const handleFormChange = jest.fn();
  const itemFormError = {
    name: false,
    type: false,
    unit: false,
    image: false,
    total_quantityopen: false,
    total_quantityunopened: false,
    min_quantityopen: false,
    min_quantityunopened: false,
  };

  beforeEach(() => {
    render(
      <AddItemForm
        itemFormData={itemFormData}
        handleFormChange={handleFormChange}
        itemFormError={itemFormError}
      />,
    );
  });

  test('renders the form with initial values', () => {
    expect(screen.getByRole('textbox', { name: /Name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Unit/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Image/i })).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: /Total Quantity \(Open\)/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: /Total Quantity \(Unopened\)/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: /Min Quantity \(Open\)/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: /Min Quantity \(Unopened\)/i }),
    ).toBeInTheDocument();
  });

  test('calls handleFormChange when form fields are changed', () => {
    fireEvent.change(screen.getByRole('textbox', { name: /Name/i }), {
      target: { value: 'Test Name' },
    });
    expect(handleFormChange).toHaveBeenCalledTimes(1);
    expect(handleFormChange).toHaveBeenCalledWith(expect.any(Object));

    fireEvent.change(screen.getByRole('textbox', { name: /Unit/i }), {
      target: { value: 'kg' },
    });
    expect(handleFormChange).toHaveBeenCalledTimes(2);
    expect(handleFormChange).toHaveBeenCalledWith(expect.any(Object));

    fireEvent.change(screen.getByRole('textbox', { name: /Image/i }), {
      target: { value: 'test.jpg' },
    });
    expect(handleFormChange).toHaveBeenCalledTimes(3);
    expect(handleFormChange).toHaveBeenCalledWith(expect.any(Object));

    fireEvent.change(
      screen.getByRole('spinbutton', { name: /Total Quantity \(Open\)/i }),
      { target: { value: '10' } },
    );
    expect(handleFormChange).toHaveBeenCalledTimes(4);
    expect(handleFormChange).toHaveBeenCalledWith(expect.any(Object));

    fireEvent.change(
      screen.getByRole('spinbutton', { name: /Total Quantity \(Unopened\)/i }),
      { target: { value: '5' } },
    );
    expect(handleFormChange).toHaveBeenCalledTimes(5);
    expect(handleFormChange).toHaveBeenCalledWith(expect.any(Object));

    fireEvent.change(
      screen.getByRole('spinbutton', { name: /Min Quantity \(Open\)/i }),
      { target: { value: '2' } },
    );
    expect(handleFormChange).toHaveBeenCalledTimes(6);
    expect(handleFormChange).toHaveBeenCalledWith(expect.any(Object));

    fireEvent.change(
      screen.getByRole('spinbutton', { name: /Min Quantity \(Unopened\)/i }),
      { target: { value: '1' } },
    );
    expect(handleFormChange).toHaveBeenCalledTimes(7);
    expect(handleFormChange).toHaveBeenCalledWith(expect.any(Object));
  });
});
