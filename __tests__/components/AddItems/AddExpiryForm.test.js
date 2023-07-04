import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import AddExpiryForm from '../../../components/AddItems/AddExpiryForm';

describe('AddExpiryForm', () => {
  const expiryFormData = {
    name: '',
    type: '',
    unit: '',
    image: '',
    expiry: [],
    min_quantityopen: '',
    min_quantityunopened: '',
  };

  const handleFormChange = jest.fn();
  const setExpiryFormData = jest.fn();
  const setExpiryFormError = jest.fn();

  const expiryFormError = {
    name: false,
    type: false,
    unit: false,
    image: false,
    expiry: [],
    min_quantityopen: false,
    min_quantityunopened: false,
  };

  beforeEach(() => {
    render(
      <AddExpiryForm
        expiryFormData={expiryFormData}
        handleFormChange={handleFormChange}
        expiryFormError={expiryFormError}
        setExpiryFormData={setExpiryFormData}
        setExpiryFormError={setExpiryFormError}
      />,
    );
  });

  test('renders the form with initial values', () => {
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Unit')).toBeInTheDocument();
    expect(screen.getByText('Image')).toBeInTheDocument();
    expect(screen.getByText('Min Quantity (Open)')).toBeInTheDocument();
    expect(screen.getByText('Min Quantity (Unopened)')).toBeInTheDocument();
  });

  test('calls handleFormChange when form fields are changed', () => {
    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), {
      target: { value: 'Test Name' },
    });
    expect(handleFormChange).toHaveBeenCalledTimes(1);
    expect(handleFormChange).toHaveBeenCalledWith(expect.any(Object));

    fireEvent.change(screen.getByRole('textbox', { name: 'Unit' }), {
      target: { value: 'kg' },
    });
    expect(handleFormChange).toHaveBeenCalledTimes(2);
    expect(handleFormChange).toHaveBeenCalledWith(expect.any(Object));

    fireEvent.change(screen.getByRole('textbox', { name: 'Image' }), {
      target: { value: 'test.jpg' },
    });
    expect(handleFormChange).toHaveBeenCalledTimes(3);
    expect(handleFormChange).toHaveBeenCalledWith(expect.any(Object));

    fireEvent.change(
      screen.getByRole('spinbutton', { name: 'Min Quantity (Open)' }),
      { target: { value: '10' } },
    );
    expect(handleFormChange).toHaveBeenCalledTimes(4);
    expect(handleFormChange).toHaveBeenCalledWith(expect.any(Object));

    fireEvent.change(
      screen.getByRole('spinbutton', { name: 'Min Quantity (Unopened)' }),
      { target: { value: '5' } },
    );
    expect(handleFormChange).toHaveBeenCalledTimes(5);
    expect(handleFormChange).toHaveBeenCalledWith(expect.any(Object));
  });

  test('calls setExpiryFormData and setExpiryFormError when handleAddExpiry is called', () => {
    fireEvent.click(screen.getByText('Add'));
    expect(setExpiryFormData).toHaveBeenCalledTimes(1);
    expect(setExpiryFormData).toHaveBeenCalledWith(expect.any(Function));

    expect(setExpiryFormError).toHaveBeenCalledTimes(1);
    expect(setExpiryFormError).toHaveBeenCalledWith(expect.any(Function));
  });
});
