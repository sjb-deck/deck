import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { Stack, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import React, { useContext } from 'react';

import { useSubmitKitOrder } from '../../hooks/mutations';
import { KitCartContext } from '../../providers';
import { getDjangoFriendlyDate } from '../../utils';
import { EmptyMessage } from '../EmptyMessage';
import { Paper } from '../styled';

import '../../globals/styles/inventoryBase.scss';

import { KitCartItems } from './KitCartItems';
import { validationSchema } from './schema';

export const KitCartContent = () => {
  const { kitCartItems, clearCart } = useContext(KitCartContext);
  const isEmpty = kitCartItems.length == 0;
  const { mutate } = useSubmitKitOrder();
  const formik = useFormik({
    initialValues: {
      loaneeName: '',
      returnDate: dayjs(),
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const data = {
        kit_ids: kitCartItems.map((k) => k.id),
        force: true,
        loanee_name: values.loaneeName,
        due_date: getDjangoFriendlyDate(values.returnDate),
      };
      mutate(data, {
        onSuccess: () => {
          window.location.href = '/inventory/kits';
          clearCart();
        },
      });
    },
  });

  if (isEmpty) {
    return (
      <EmptyMessage message='The cart is empty, deposit/withdraw items and it will appear here' />
    );
  }

  return (
    <Stack
      className='nav-margin-compensate'
      spacing={3}
      padding={1}
      sx={{
        alignItems: 'center',
        justifyContent: 'start',
        width: '100%',
        marginBottom: '50px',
        minHeight: '100vh',
      }}
    >
      <>
        <Paper className='dynamic-width' style={{ padding: 20 }} elevation={3}>
          <Stack justifyContent='center' alignItems='center' spacing={2}>
            <Typography variant='h4' alignSelf='start'>
              Withdraw Kit Cart
            </Typography>
            <TextField
              key='loaneeName'
              label='Loanee Name'
              name='loaneeName'
              fullWidth
              value={formik.values.loaneeName}
              onChange={formik.handleChange}
              error={!!formik.errors.loaneeName}
              helperText={
                !!formik.errors.loaneeName && formik.errors.loaneeName
              }
            />
            <DatePicker
              key='returnDate'
              label='Return Date'
              name='returnDate'
              defaultValue={dayjs()}
              format='LL'
              disablePast
              sx={{ width: '100%' }}
              value={formik.values.returnDate}
              onChange={(date) => formik.setFieldValue('returnDate', date)}
              error={!!formik.errors.returnDate}
              helperText={
                !!formik.errors.returnDate && formik.errors.returnDate
              }
            />
          </Stack>
        </Paper>
        <KitCartItems />
        <LoadingButton
          role='submit-button'
          className='dynamic-width'
          variant='contained'
          onClick={formik.handleSubmit}
          endIcon={<SendIcon />}
          color={'error'}
          sx={{ marginBottom: '20px' }}
        >
          Submit
        </LoadingButton>
      </>
    </Stack>
  );
};
