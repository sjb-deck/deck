import * as yup from 'yup';

export const kitAddValidation = yup.object({
  name: yup.string().required('Name cannot be empty'),
  blueprint: yup.number().required('Select a blueprint'),
  kitContent: yup
    .object()
    .required()
    .test('expiryQty', (kitContent, ctx) => {
      const errorMap = {};
      for (const [itemId, expiryObj] of Object.entries(kitContent)) {
        for (const [expiryId, expiry] of Object.entries(expiryObj)) {
          if (expiry.quantity > expiry.expiryTotalQty) {
            errorMap[itemId] = {
              ...errorMap[itemId],
              [expiryId]: 'Insufficient quantity',
            };
          }
        }
      }

      return Object.entries(errorMap).length === 0
        ? true
        : ctx.createError({ message: errorMap });
    }),
  itemTotalQty: yup
    .object()
    .required()
    .test('itemQty', (itemTotalQty, ctx) => {
      const errorMap = {};
      for (const [itemId, item] of Object.entries(itemTotalQty)) {
        if (item.quantity > item.totalQuantity) {
          errorMap[itemId] = 'Required quantity exceeded';
        }
      }
      return Object.entries(errorMap).length === 0
        ? true
        : ctx.createError({ message: errorMap });
    }),
});
