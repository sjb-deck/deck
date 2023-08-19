import * as yup from 'yup';

import { CART_ITEM_TYPE_WITHDRAW } from '../../globals';

export const getValidationSchema = (
  cartType,
  item,
  cartItems,
  selectedExpiryId,
) =>
  yup.object({
    quantity: yup
      .number('Enter a number for opened quantity')
      .required('Quantity is required')
      .moreThan(0, 'Number must be greater than 0')
      .test(
        'is-more-than-quantity',
        'Withdraw quantity is more than what is available',
        function (value) {
          if (cartType === CART_ITEM_TYPE_WITHDRAW) {
            const currWithdrawnQty =
              cartItems.find((x) => x.expiryId === selectedExpiryId)
                ?.cartQuantity ?? 0;
            const currItemExpiryQty = item.expiry_dates.find(
              (x) => x.id === selectedExpiryId,
            ).quantity;
            return value && value <= currItemExpiryQty - currWithdrawnQty;
          } else {
            return true;
          }
        },
      ),
  });
