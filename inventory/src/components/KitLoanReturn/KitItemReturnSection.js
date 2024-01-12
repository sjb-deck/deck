import React from 'react';

import { Box, Typography } from '@mui/material';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { ItemReturnSlider } from './ItemReturnSlider';

export const KitItemReturnSection = ({ kitData }) => {
  return (
    <Box
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <Typography variant='h5'>Kit Content</Typography>
      <TableContainer>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell width='30%'>Item</TableCell>
              <TableCell width='15%'>Quantity</TableCell>
              <TableCell width='15%'>Expiry Date</TableCell>
              <TableCell width='40%' align='center'>
                Remaining
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kitData.map((item, index) => (
              <TableRow
                key={item.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>
                  {item.name}
                </TableCell>
                <TableCell>
                  {getFractionOfItem(item.quantity, item.blueprint_quantity)}
                </TableCell>
                <TableCell>{item.expiry_date ?? 'No Expiry'}</TableCell>
                <TableCell>
                  <ItemReturnSlider
                    original_quantity={item.quantity}
                    update={update(kitData, index)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const update = (kitData, index) => (new_quantity) => {
  kitData[index].new_quantity = new_quantity;
};

const getFractionOfItem = (quantity, blueprint_quantity) => {
  if (!blueprint_quantity) return quantity;
  return `${quantity} / ${blueprint_quantity}`;
};
