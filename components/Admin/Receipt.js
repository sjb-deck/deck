import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import React from 'react';

// const OrderReceipt = (props) => {
function Receipt(props) {
  // props will have OrderData which is json data from the url

  const orderDetails = props.orderData;
  const orderID = orderDetails.id;
  const orderItems = orderDetails.order_items;

  return (
    <div style={{ width: '90%', margin: '0 auto' }}>
      <h1>Hello</h1>
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
  );
}

Receipt.propTypes = {
  orderData: PropTypes.shape({
    id: PropTypes.number,
    order_items: PropTypes.array,
  }),
};

export default Receipt;
