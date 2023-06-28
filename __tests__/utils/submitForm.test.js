import '@testing-library/jest-dom';

import { checkExpiryFormData } from '../../utils/submitForm';
import { checkItemFormData } from '../../utils/submitForm';

describe('checkItemFormData', () => {
  let itemFormData;
  let setActiveStep;
  let items;
  let setItemFormError;
  let setItemPotentialMatch;
  let setItemPotentialMatchDialogOpen;

  beforeEach(() => {
    itemFormData = {
      name: 'Test Item',
      type: 'Type',
      unit: 'kg',
      image: 'image_example.com',
      total_quantityopen: '10',
      total_quantityunopened: '5',
      min_quantityopen: '2',
      min_quantityunopened: '1',
    };
    setActiveStep = jest.fn();
    items = [];
    setItemFormError = jest.fn();
    setItemPotentialMatch = jest.fn();
    setItemPotentialMatchDialogOpen = jest.fn();
  });

  test('calls setActiveStep if there are no validation errors', () => {
    checkItemFormData(
      itemFormData,
      setActiveStep,
      items,
      setItemFormError,
      setItemPotentialMatch,
      setItemPotentialMatchDialogOpen,
    );
    expect(setItemFormError).toHaveBeenCalledTimes(0);
    expect(setActiveStep).toHaveBeenCalledTimes(1);
  });

  test('sets item form error and does not call setActiveStep if there are validation errors', () => {
    itemFormData.total_quantityopen = 'abc';
    checkItemFormData(
      itemFormData,
      setActiveStep,
      items,
      setItemFormError,
      setItemPotentialMatch,
      setItemPotentialMatchDialogOpen,
    );
    expect(setItemFormError).toHaveBeenCalledTimes(1);
    expect(setActiveStep).not.toHaveBeenCalled();

    itemFormData.total_quantityopen = '10';
    itemFormData.name = '';
    checkItemFormData(
      itemFormData,
      setActiveStep,
      items,
      setItemFormError,
      setItemPotentialMatch,
      setItemPotentialMatchDialogOpen,
    );
    expect(setItemFormError).toHaveBeenCalledTimes(2);
    expect(setActiveStep).not.toHaveBeenCalled();
  });
});

describe('checkExpiryFormData', () => {
  let expiryFormData;
  let setActiveStep;
  let items;
  let setExpiryFormError;
  let setItemPotentialMatch;
  let setItemPotentialMatchDialogOpen;

  beforeEach(() => {
    expiryFormData = {
      name: 'Test Item',
      type: 'Type',
      unit: 'kg',
      image: 'image_example.com',
      expiry: [
        {
          date: '2050-06-28',
          total_quantityopen: '10',
          total_quantityunopened: '5',
        },
      ],
      min_quantityopen: '2',
      min_quantityunopened: '1',
    };
    setActiveStep = jest.fn();
    items = []; // Mock items array
    setExpiryFormError = jest.fn();
    setItemPotentialMatch = jest.fn();
    setItemPotentialMatchDialogOpen = jest.fn();
  });

  test('calls setActiveStep if there are no validation errors', () => {
    checkExpiryFormData(
      expiryFormData,
      setActiveStep,
      items,
      setExpiryFormError,
      setItemPotentialMatch,
      setItemPotentialMatchDialogOpen,
    );
    expect(setExpiryFormError).toHaveBeenCalledTimes(0);
    expect(setActiveStep).toHaveBeenCalledTimes(1);
  });

  test('sets expiry form error and does not call setActiveStep if there are validation errors', () => {
    expiryFormData.expiry[0].total_quantityopen = 'abc';
    checkExpiryFormData(
      expiryFormData,
      setActiveStep,
      items,
      setExpiryFormError,
      setItemPotentialMatch,
      setItemPotentialMatchDialogOpen,
    );
    expect(setExpiryFormError).toHaveBeenCalledTimes(1);
    expect(setActiveStep).not.toHaveBeenCalled();

    expiryFormData.expiry[0].total_quantityopen = '10';
    expiryFormData.name = '';
    checkExpiryFormData(
      expiryFormData,
      setActiveStep,
      items,
      setExpiryFormError,
      setItemPotentialMatch,
      setItemPotentialMatchDialogOpen,
    );
    expect(setExpiryFormError).toHaveBeenCalledTimes(2);
    expect(setActiveStep).not.toHaveBeenCalled();
  });
});
