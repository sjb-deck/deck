import { Chip, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useOrder } from '../../hooks/queries';
import { LoadingSpinner } from '../LoadingSpinner';

import { ReceiptDetails } from './ReceiptDetails';
import { ReceiptItem } from './ReceiptItem';

import '../../globals/styles/inventoryBase.scss';

const getOrderInfo = (orderData) => {
  // eslint-disable-next-line no-unused-vars
  const { id, order_items: orderItems, user, ...orderInfo } = orderData;
  const orderInfoWithFriendlyDate = {
    ...orderInfo,
    ...(orderInfo.due_date && {
      due_date: new Date(orderInfo.due_date).toDateString(),
    }),
    ...(orderInfo.return_date && {
      return_date: new Date(orderInfo.return_date).toLocaleString(),
    }),
    ...(orderInfo.date && {
      date: new Date(orderInfo.date).toLocaleString(),
    }),
  };
  const orderInfoWithUser = {
    user: user.extras.name,
    ...orderInfoWithFriendlyDate,
  };
  const orderInfoWithFriendlyStatus = {
    ...orderInfoWithUser,
    ...(Object.prototype.hasOwnProperty.call(
      orderInfoWithUser,
      'loan_active',
    ) && {
      loan_active: orderInfoWithUser.loan_active ? (
        <Chip label='Active' color='success' />
      ) : (
        <Chip label='Inactive' color='error' />
      ),
    }),
  };

  return orderInfoWithFriendlyStatus;
};

export function Receipt({ orderId }) {
  const { data, isLoading, isError } = useOrder(orderId);

  return (
    <Stack
      className='nav-margin-compensate'
      spacing={2}
      sx={{
        justifyContent: 'start',
        alignItems: 'center',
        marginBottom: '100px',
        minHeight: '100vh',
      }}
    >
      {isLoading || isError ? (
        <LoadingSpinner />
      ) : (
        <>
          <Box sx={{ mt: 20 }}>
            <Typography variant='h4' align='center'>
              Order {orderId} Confirmed!
            </Typography>
            <Typography variant='body1' align='center'>
              View your order details below:
            </Typography>
          </Box>
          <ReceiptDetails details={getOrderInfo(data)} />
          {data.order_items.map((orderItem) => {
            return <ReceiptItem key={orderItem.id} item={orderItem} />;
          })}
        </>
      )}
    </Stack>
  );
}
