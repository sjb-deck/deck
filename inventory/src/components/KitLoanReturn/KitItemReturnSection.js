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

export const KitItemReturnSection = ({ kitContents, kitBlueprint }) => {
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
            {kitContents.map((item) => (
              <TableRow
                key={item.item_expiry_id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>
                  {item.item_expiry.item.name}
                </TableCell>
                <TableCell>{getFractionOfItem(item, kitBlueprint)}</TableCell>
                <TableCell>
                  {item.item_expiry.expiry_date ?? 'No Expiry'}
                </TableCell>
                <TableCell>
                  <ItemReturnSlider quantity={item.quantity} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const getFractionOfItem = (item, blueprint) => {
  if (!blueprint) return item.quantity;

  const blueprintItem = blueprint.find((blueprintItem) => {
    return blueprintItem.id == item.item_expiry.item.id;
  });

  return blueprintItem?.required_quantity
    ? `${item.quantity} / ${blueprintItem.required_quantity}`
    : item.quantity;
};
