import AddIcon from '@mui/icons-material/Add';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  Button,
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
import { useEffect, useState } from 'react';

import { ORDERS_PER_PAGE } from '../../globals/constants';
import { EmptyMessage } from '../EmptyMessage';

export const BlueprintItemTable = ({ items, updateSelectedItems }) => {
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
        (!searchTerm ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (currentType === 'All' || currentType === item.type),
    );
    setItemsToDisplay(newItems);
  }, [searchTerm, types, currentType, items]);

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  const handleAddButtonClick = (id) => {
    setItemsToDisplay((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const selectedQty = item.selectedQty + 1;
          return { ...item, selectedQty: selectedQty };
        }
        return item;
      }),
    );
    items.forEach((item) => {
      if (item.id === id) {
        item.selectedQty += 1;
        updateSelectedItems(item.id, item.name, item.selectedQty);
      }
      return item;
    });
  };
  const handleMinusButtonClick = (id) => {
    setItemsToDisplay((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const selectedQty = item.selectedQty - 1;
          return { ...item, selectedQty: selectedQty };
        }
        return item;
      }),
    );
    items.forEach((item) => {
      if (item.id === id) {
        item.selectedQty -= 1;
        updateSelectedItems(item.id, item.name, item.selectedQty);
      }
      return item;
    });
  };
  const handleInputChange = (id, quantity, totalQty) => {
    if (quantity !== '') {
      quantity = parseInt(quantity);
    }
    if (quantity === '' || (0 <= quantity && quantity <= totalQty)) {
      setItemsToDisplay((prevItems) =>
        prevItems.map((item) => {
          if (item.id === id) {
            return { ...item, selectedQty: quantity };
          }
          return item;
        }),
      );
      items.forEach((item) => {
        if (item.id === id) {
          item.selectedQty = quantity;
          updateSelectedItems(item.id, item.name, item.selectedQty);
          return item;
        }
      });
    } else {
      items.forEach((item) => {
        if (item.id === id) {
          item.selectedQty = quantity;
          updateSelectedItems(item.id, item.name, 0);
          return item;
        }
      });
    }
  };
  const handleOnFocus = (id) => {
    setItemsToDisplay((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id && item.selectedQty === 0) {
          return { ...item, selectedQty: '' };
        }
        return item;
      }),
    );
    items.forEach((item) => {
      if (item.id === id && item.selectedQty === '') {
        item.selectedQty = 0;
      }
    });
  };
  const handleOnBlur = (id) => {
    setItemsToDisplay((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id && item.selectedQty === '') {
          updateSelectedItems(item.id, item.name, 0);
          return { ...item, selectedQty: 0 };
        } else if (item.id === id && item.selectedQty > item.total_quantity) {
          return { ...item, selectedQty: item.total_quantity };
        }
        return item;
      }),
    );
    items.forEach((item) => {
      if (item.id === id && item.selectedQty === '') {
        item.selectedQty = 0;
      } else if (item.id === id && item.selectedQty > item.total_quantity) {
        item.selectedQty = item.total_quantity;
      }
    });
  };

  return (
    <Box className='dynamic-width'>
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
            {itemsToDisplay.length > 0 ? (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell align={'center'}>Unit</TableCell>
                    <TableCell align={'center'}>Total Qty</TableCell>
                    <TableCell align={'center'}>Qty To Add</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemsToDisplay.slice(startIndex, endIndex).map((item) => (
                    <TableRow key={item.id} data-testid={`item-row-${item.id}`}>
                      <TableCell data-testid='item_name'>{item.name}</TableCell>
                      <TableCell data-testid='item_unit' align={'center'}>
                        {item.unit}
                      </TableCell>
                      <TableCell data-testid='item_qty' align={'center'}>
                        {item.total_quantity}
                      </TableCell>
                      <TableCell className='create-blueprint-input-container'>
                        <Box display={'flex'} justifyContent={'center'}>
                          <Button
                            className='create-blueprint-btn'
                            disabled={
                              item.selectedQty <= 0 || item.selectedQty === ''
                            }
                            onClick={() => handleMinusButtonClick(item.id)}
                          >
                            <RemoveIcon />
                          </Button>
                          <TextField
                            id='outlined-basic'
                            label='Qty'
                            type='number'
                            className='create-blueprint-qty-input'
                            value={item.selectedQty}
                            onChange={(e) => {
                              handleInputChange(
                                item.id,
                                e.target.value,
                                item.total_quantity,
                              );
                            }}
                            onFocus={(e) => {
                              handleOnFocus(item.id);
                            }}
                            onBlur={(e) => {
                              handleOnBlur(item.id);
                            }}
                          />
                          <Button
                            className='create-blueprint-btn'
                            disabled={
                              item.selectedQty >= item.total_quantity ||
                              item.selectedQty === ''
                            }
                            onClick={() => handleAddButtonClick(item.id)}
                          >
                            <AddIcon />
                          </Button>
                        </Box>
                      </TableCell>
                      <TableCell className='create-blueprint-indicator'>
                        {item.selectedQty === 0 || item.selectedQty === '' ? (
                          <RadioButtonUncheckedIcon />
                        ) : (
                          <RadioButtonCheckedIcon />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            ) : (
              <EmptyMessage message={'No matching items found'} />
            )}
          </Table>
        </TableContainer>
        {items ? (
          <Pagination
            page={currentPage}
            count={Math.ceil(itemsToDisplay.length / ORDERS_PER_PAGE)}
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
