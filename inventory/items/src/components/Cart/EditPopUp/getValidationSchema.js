import * as yup from 'yup';

import { CART_ITEM_TYPE_WITHDRAW } from '../../../../../src/globals';

export const getValidationSchema = (cartItem) => {
  const selectedExpiryId = cartItem.expiryId;
  const cartType = cartItem.type;

  return yup.object({
    quantity: yup
      .number('Enter a number for opened quantity')
      .required('Quantity is required')
      .moreThan(0, 'Number must be greater than 0')
      .test(
        'is-more-than-quantity',
        'Withdraw quantity is more than what is available',
        function (value) {
          if (cartType === CART_ITEM_TYPE_WITHDRAW) {
            const currItemExpiryQty = cartItem.expiry_dates.find(
              (x) => x.id === selectedExpiryId,
            ).quantity;
            return value && value <= currItemExpiryQty;
          } else {
            return true;
          }
        },
      ),
  });
};
