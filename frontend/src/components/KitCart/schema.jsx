import * as yup from 'yup';
const minimumDate = new Date();
minimumDate.setHours(0, 0, 0, 0);
export const validationSchema = yup.object({
  loaneeName: yup.string().required('Loanee name is required'),
  returnDate: yup
    .date()
    .required()
    .min(minimumDate, 'Return date must be today or later')
    .required('Return date is required'),
});
