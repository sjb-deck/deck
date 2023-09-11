import * as yup from 'yup';

export const validationSchema = yup.object({
  loaneeName: yup.string().when('selectedOption', (selectedOption, schema) => {
    return selectedOption == 'loan'
      ? schema.required('Loanee Name is required')
      : schema;
  }),
  returnDate: yup
    .date()
    .nullable()
    .when('selectedOption', (selectedOption, schema) => {
      return selectedOption == 'loan'
        ? schema.required('Return Date is required')
        : schema;
    }),
  reason: yup.string().when('selectedOption', (selectedOption, schema) => {
    return selectedOption == 'others'
      ? schema.required('Reason is required')
      : schema;
  }),
});
