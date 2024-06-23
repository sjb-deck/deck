import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export const CreateBlueprintModalTable = ({ items }) => {
  return (
    <TableContainer component={Paper} style={{ overflow: 'scroll' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item Name</TableCell>
            <TableCell align={'center'}>Qty Added</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.length === 0 ? (
            <TableRow key='No_items_added'>
              <TableCell colSpan={2}>
                <p style={{ textAlign: 'center' }}>No items added!</p>
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id} data-testid={`item-row-${item.id}`}>
                <TableCell>{item.name}</TableCell>
                <TableCell align={'center'}>{item.quantity}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
