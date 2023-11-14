import {
  Accordion,
  AccordionSummary,
  Box,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  TextField,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

import { useRevertOrder } from '../../hooks/mutations';
import { useOrders } from '../../hooks/queries';
import { EmptyMessage } from '../EmptyMessage';
import { LoadingSpinner } from '../LoadingSpinner';

import { OrderContent } from './OrderContent';

export const OrderList = () => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermInput, setSearchTermInput] = useState('');
  // empty dependency array added to prevent repeated calls to API
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 500),
    [],
  );
  const [filter, setFilter] = useState('item');
  const { data: orders, isLoading: dataLoading } = useOrders({
    page: currentPage,
    [filter]: searchTerm,
  });
  const [ordersToDisplay, setOrdersToDisplay] = useState(orders?.results);
  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };
  const { mutate, isLoading } = useRevertOrder();
  const handleDeleteOrder = async (id) => {
    mutate(id);
  };

  useEffect(() => {
    if (!orders) return;
    setOrdersToDisplay(orders.results);
  }, [orders]);

  return (
    <Box
      sx={{
        width: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {isLoading || dataLoading ? <LoadingSpinner /> : null}
      <Box
        className='dynamic-width'
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <TextField
          label='Search'
          value={searchTermInput}
          onChange={(e) => {
            setSearchTermInput(e.target.value);
            debouncedSetSearchTerm(e.target.value);
          }}
          sx={{ width: 1 }}
        />
        <Select
          inputProps={{ 'data-testid': 'search-select' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value='item'>Item</MenuItem>
          <MenuItem value='username'>User</MenuItem>
        </Select>
      </Box>
      <Accordion
        expanded={false}
        sx={{
          maxWidth: '750px',
          minWidth: isMobile ? '95%' : '70%',
          cursor: 'initial',
          paddingRight: '24px',
        }}
      >
        <AccordionSummary>
          <Grid container>
            <Grid item xs={2}>
              ID
            </Grid>
            <Grid item xs={isMobile ? 5 : 3}>
              Action
            </Grid>
            <Grid item xs={isMobile ? 5 : 4}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingRight: '16px',
                }}
              >
                <span>Date</span>
              </Box>
            </Grid>
            {!isMobile && (
              <Grid item xs={3}>
                Reason
              </Grid>
            )}
          </Grid>
        </AccordionSummary>
      </Accordion>

      <Stack
        direction='column'
        justifyContent='space-between'
        alignItems='center'
        spacing={3}
        sx={{
          marginTop: 1,
          minHeight: 0.8,
          width: 1,
        }}
      >
        <Box
          sx={{
            width: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {!dataLoading && ordersToDisplay?.length === 0 && (
            <EmptyMessage
              message='There are no orders matching your search parameters'
              fullscreen={false}
            />
          )}
          {!dataLoading &&
            ordersToDisplay?.length > 0 &&
            ordersToDisplay?.map((order) => {
              return (
                <OrderContent
                  key={order.id}
                  order={order}
                  isMobile={isMobile}
                  isLoading={isLoading || dataLoading}
                  handleDeleteOrder={handleDeleteOrder}
                />
              );
            })}
        </Box>
        {orders ? (
          <Pagination
            page={currentPage}
            count={orders.num_pages}
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
