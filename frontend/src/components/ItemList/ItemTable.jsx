import {
  Box,
  MenuItem,
  Paper,
  Pagination,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { ORDERS_PER_PAGE } from '../../globals/constants';

export const ItemTable = ({ items }) => {
  const [itemsToDisplay, setItemsToDisplay] = useState(items);
  const [searchTerm, setSearchTerm] = useState('');
  const [types, setTypes] = useState([]);
  const [currentType, setCurrentType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const endIndex = startIndex + ORDERS_PER_PAGE;
  useEffect(() => {
    const tmpTypes = ['All'];
    items.map(
      (item) => !tmpTypes.includes(item.type) && tmpTypes.push(item.type),
    );
    setTypes(tmpTypes);
  }, [items]);

  useEffect(() => {
    const newItems = items.filter(
      (item) =>
        (!searchTerm || item.name.includes(searchTerm.toLowerCase())) &&
        (currentType === 'All' || currentType === item.type),
    );
    setItemsToDisplay(newItems);
  }, [searchTerm, types, currentType, items]);

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

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
      <Stack spacing={3} alignItems={'center'}>
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
              {itemsToDisplay.slice(startIndex, endIndex).map((item) => (
                <TableRow key={item.id} data-testid={`item-row-${item.id}`}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.expiry_date ?? 'None'}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.is_opened ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {items ? (
          <Pagination
            page={currentPage}
            count={Math.ceil(items.length / ORDERS_PER_PAGE)}
            onChange={handlePageChange}
          />
        ) : (
          <Skeleton>
            <Pagination />
          </Skeleton>
        )}
      </Stack>
    </Box>
  );
};
