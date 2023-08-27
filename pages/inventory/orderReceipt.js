import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React from 'react';

import { NavBar, Theme } from '../../components';

const OrderReceipt = () => {
  const params = new URLSearchParams(window.location.search);

  const orderDetails = JSON.parse(params.get('orderData'));
  console.log(orderDetails);

  const orderID = orderDetails.id;
  const user = orderDetails.user;
  const orderItems = orderDetails.order_items;

  console.log(orderID);
  console.log(orderItems);

  return (
    <Theme>
      <NavBar user={user}></NavBar>
      <div style={{ width: '90%', margin: '0 auto' }}>
        <Box sx={{ mt: 20 }}>
          <Typography variant='h4' align='center'>
            Order {orderID} Confirmed!
          </Typography>
          <Typography variant='body1' align='center'>
            View your order details below:
          </Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align='right'>Expiry Date</TableCell>
                <TableCell align='right'>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderItems.map((orderItem) => (
                <TableRow
                  key={orderItem.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component='th' scope='row'>
                    {orderItem.id}
                  </TableCell>
                  <TableCell align='right'>
                    {orderItem.item_expiry.expiry_date}
                  </TableCell>
                  <TableCell align='right'>
                    {orderItem.ordered_quantity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Theme>
  );
};

export default OrderReceipt;
