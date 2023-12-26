import React from 'react';

import { Box, Typography, Slider } from '@mui/material';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { ItemReturnSlider } from './ItemReturnSlider';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export const KitItemReturnSection = () => {
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
      <TableContainer
        sx={{
          display: 'flex',
          minHeight: '100%',
          width: '100%',
          flexGrow: 1,
        }}
      >
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
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>
                  {row.name}
                </TableCell>
                <TableCell>{row.calories}</TableCell>
                <TableCell>{row.fat}</TableCell>
                <TableCell>
                  <ItemReturnSlider />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
