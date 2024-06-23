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

export const KitItemReturnSection = ({ kitData, updateKitData }) => {
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
              <TableCell width='15%'>Expiry Date</TableCell>
              <TableCell width='15%'>Quantity</TableCell>
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
                <TableCell>{item.expiry_date}</TableCell>
                <TableCell>{item.shown_quantity}</TableCell>
                <TableCell>
                  <ItemReturnSlider
                    originalQuantity={item.quantity}
                    update={updateKitData(index)}
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
