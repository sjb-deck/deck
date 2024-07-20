import { beforeEach, describe, expect, it, vi } from 'vitest';

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
      total_quantity: '10',
      min_quantity: '2',
    };
    setActiveStep = vi.fn();
    items = [];
    setItemFormError = vi.fn();
    setItemPotentialMatch = vi.fn();
    setItemPotentialMatchDialogOpen = vi.fn();
  });

  it('calls setActiveStep if there are no validation errors', () => {
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

  it('sets item form error and does not call setActiveStep if there are validation errors', () => {
    itemFormData.total_quantity = 'abc';
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

    itemFormData.total_quantity = '10';
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
          quantity: '10',
        },
      ],
      min_quantity: '2',
    };
    setActiveStep = vi.fn();
    items = []; // Mock items array
    setExpiryFormError = vi.fn();
    setItemPotentialMatch = vi.fn();
    setItemPotentialMatchDialogOpen = vi.fn();
  });

  it('calls setActiveStep if there are no validation errors', () => {
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

  it('sets expiry form error and does not call setActiveStep if there are validation errors', () => {
    expiryFormData.expiry[0].quantity = 'abc';
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

    expiryFormData.expiry[0].quantity = '10';
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
