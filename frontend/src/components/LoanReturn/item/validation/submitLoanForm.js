const isValidNonNegativeInteger = (value) => {
  return /^\d+$/.test(value);
};

function hasNoErrors(errors) {
  for (let i = 0; i < errors.length; i++) {
    if (errors[i].returnQuantity) {
      return false;
    }
  }
  return true;
}

function createQuantitiesArray(quantities) {
  const quantitiesArray = [];
  for (let i = 0; i < quantities.length; i++) {
    quantitiesArray.push({ returnQuantity: false });
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
    const returnQuantity = parseInt(quantities[i].returnQuantity, 10);

    if (
      !isValidNonNegativeInteger(quantities[i].returnQuantity) ||
      returnQuantity < 0
    ) {
      errors[i].returnQuantity = true;
    }

    // Update the quantities array with parsed integer values
    quantities[i].returnQuantity = returnQuantity;
  }

  // Check if all quantities are not larger than their corresponding quantities in order_items
  for (let i = 0; i < items.length; i++) {
    const orderItem = items[i];
    const returnQuantity = quantities[i].returnQuantity;

    if (
      returnQuantity > orderItem.ordered_quantity &&
      errors[i].returnQuantity === false
    ) {
      errors[i].returnQuantity = true;
    }
  }
  setErrors(errors);

  return !!hasNoErrors(errors);
};

export { checkLoanReturnForm };
