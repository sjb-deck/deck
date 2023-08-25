import { Sort } from '@mui/icons-material';
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
import { PropTypes } from 'prop-types';
import React, { useEffect, useState } from 'react';

import { OrderPropType, ORDERS_PER_PAGE } from '../../globals';
import { useRevertOrder } from '../../hooks/mutations';

import { OrderContent } from './OrderContent';

export const OrderList = ({ orders }) => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('item');
  const [searchTerm, setSearchTerm] = useState('');
  const [ordersToDisplay, setOrdersToDisplay] = useState(orders);
  const [dateEarliest, setDateEarliest] = useState(false);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const endIndex = startIndex + ORDERS_PER_PAGE;
  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };
  const { mutate, isLoading } = useRevertOrder();
  const handleDeleteOrder = async (id) => {
    mutate(id);
  };

  const handleSortDate = () => {
    const newOrders = ordersToDisplay.sort((o1, o2) =>
      dateEarliest
        ? new Date(o1.date) - new Date(o2.date)
        : new Date(o2.date) - new Date(o1.date),
    );
    setOrdersToDisplay(newOrders);
    setDateEarliest(!dateEarliest);
  };

  useEffect(() => {
    const newOrders = orders.filter(
      (o) =>
        !searchTerm ||
        (filter === 'item' &&
          o.order_items.some((i) =>
            i.item_expiry.item.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
          )) ||
        (filter === 'user' &&
          o.user.username.toLowerCase().includes(searchTerm.toLowerCase())),
    );
    setOrdersToDisplay(newOrders);
  }, [filter, searchTerm, orders]);

  return (
    <Box
      sx={{
        width: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 1 }}
        />
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <MenuItem value='item'>Item</MenuItem>
          <MenuItem value='user'>User</MenuItem>
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
                <Sort onClick={() => handleSortDate()} />
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
          {ordersToDisplay.slice(startIndex, endIndex).map((order) => {
            return (
              <OrderContent
                key={order.id}
                order={order}
                isMobile={isMobile}
                isLoading={isLoading}
                handleDeleteOrder={handleDeleteOrder}
              />
            );
          })}
        </Box>
        {orders ? (
          <Pagination
            page={currentPage}
            count={Math.ceil(orders.length / ORDERS_PER_PAGE)}
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

OrderList.propTypes = {
  orders: PropTypes.arrayOf(OrderPropType).isRequired,
};
