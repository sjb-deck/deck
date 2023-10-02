import {
  Box,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { PropTypes } from 'prop-types';
import React, { useEffect, useState } from 'react';

import { ItemPropType } from '../../globals';

const ItemTable = ({ items }) => {
  const [itemsToDisplay, setItemsToDisplay] = useState(items);
  const [searchTerm, setSearchTerm] = useState('');
  const [types, setTypes] = useState([]);
  const [currentType, setCurrentType] = useState('');

  useEffect(() => {
    const tmpTypes = [];
    items.map(
      (item) => !tmpTypes.includes(item.type) && tmpTypes.push(item.type),
    );
    setTypes(tmpTypes);
    if (tmpTypes) setCurrentType(tmpTypes[0]);
  }, [items]);

  useEffect(() => {
    const newItems = items.filter(
      (item) =>
        (!searchTerm || item.name.includes(searchTerm.toLowerCase())) &&
        (!currentType || currentType === item.type),
    );
    setItemsToDisplay(newItems);
  }, [searchTerm, types, currentType, items]);

  return (
    <Box
      sx={{
        width: {
          xs: '95%',
          sm: '90%',
          md: '70%',
        },
      }}
    >
      <Stack>
        <Box
          sx={{
            width: 1,
            display: 'flex',
            alignItems: 'center',
            marginBottom: 2,
          }}
        >
          <TextField
            label='Search'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 1 }}
          />
          <Select
            inputProps={{ 'data-testid': 'type-select' }}
            value={currentType}
            onChange={(e) => setCurrentType(e.target.value)}
          >
            {types.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Total Qty</TableCell>
                <TableCell>Opened</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itemsToDisplay.map((item) =>
                item.expiry_dates.map((expiry) => {
                  return (
                    <TableRow key={expiry.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{expiry.expiry_date ?? 'None'}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{item.total_quantity}</TableCell>
                      <TableCell>{item.is_opened ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  );
                }),
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
};

export default ItemTable;

ItemTable.propTypes = {
  items: PropTypes.arrayOf(ItemPropType).isRequired,
};
