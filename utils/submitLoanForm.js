import { INV_API_LOAN_RETURN_URL, URL_INV_LOAN_RETURN } from '../globals';

import { postWithCSRF } from './submitForm';

const isValidNonNegativeInteger = (value) => {
  return /^\d+$/.test(value);
};

function hasNoErrors(errors) {
  for (let i = 0; i < errors.length; i++) {
    if (errors[i].quantityOpened || errors[i].quantityUnopened) {
      return false;
    }
  }
  return true;
}

function createQuantitiesArray(quantities) {
  const quantitiesArray = [];
  for (let i = 0; i < quantities.length; i++) {
    quantitiesArray.push({ quantityOpened: false, quantityUnopened: false });
  }
  return quantitiesArray;
}

const checkLoanReturnForm = (items, quantities, setErrors) => {
  const errors = createQuantitiesArray(quantities);

  if (items.length !== quantities.length) {
    console.log('Error: items and quantities arrays are not the same length');
    return false;
  }

  // Check if all quantities are valid non-negative integers
  for (let i = 0; i < quantities.length; i++) {
    const quantityOpened = parseInt(quantities[i].quantityOpened, 10);
    const quantityUnopened = parseInt(quantities[i].quantityUnopened, 10);

    if (
      !isValidNonNegativeInteger(quantities[i].quantityOpened) ||
      quantityOpened < 0
    ) {
      errors[i].quantityOpened = true;
    }

    if (
      !isValidNonNegativeInteger(quantities[i].quantityUnopened) ||
      quantityUnopened < 0
    ) {
      errors[i].quantityUnopened = true;
    }

    // Update the quantities array with parsed integer values
    quantities[i].quantityOpened = quantityOpened;
    quantities[i].quantityUnopened = quantityUnopened;
  }

  // Check if all quantities are not larger than their corresponding quantities in order_items
  for (let i = 0; i < items.length; i++) {
    const orderItem = items[i];
    const quantityOpened = quantities[i].quantityOpened;
    const quantityUnopened = quantities[i].quantityUnopened;

    if (
      quantityOpened > orderItem.quantity_opened &&
      errors[i].quantityOpened === false
    ) {
      errors[i].quantityOpened = true;
    }

    if (
      quantityUnopened > orderItem.quantity_unopened &&
      errors[i].quantityUnopened === false
    ) {
      errors[i].quantityUnopened = true;
    }
  }
  setErrors(errors);
  console.log(errors);

  return !!hasNoErrors(errors);
};

const submitLoanReturn = (items, quantities, id, setLoading) => {
  const payload = {
    order_id: id,
    items: [],
  };
  for (let i = 0; i < items.length; i++) {
    payload.items.push({
      item_name: items[i].name,
      item_expiry: items[i].expiry,
      return_opened: quantities[i].quantityOpened,
      return_unopened: quantities[i].quantityUnopened,
    });
  }
  postWithCSRF(INV_API_LOAN_RETURN_URL, payload)
    .then((response) => {
      console.log(response);
      window.location.href = URL_INV_LOAN_RETURN;
    })
    .catch((error) => {
      setLoading(false);
      console.log(error);
    });
};

export { checkLoanReturnForm, submitLoanReturn };
