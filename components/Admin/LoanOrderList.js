import { Sort } from '@mui/icons-material';
import {
  Accordion,
  AccordionSummary,
  Box,
  Grid,
  Pagination,
  Skeleton,
  Stack,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { PropTypes } from 'prop-types';
import React, { useState, useEffect } from 'react';

import { LoanOrderPropType, ORDERS_PER_PAGE } from '../../globals';
import { useRevertOrder } from '../../hooks/mutations';

import { LoanOrderContent } from './LoanOrderContent';

export const LoanOrderList = ({ loanOrders }) => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('item');
  const [searchTerm, setSearchTerm] = useState('');
  const [ordersToDisplay, setOrdersToDisplay] = useState(loanOrders);
  const [dateEarliest, setDateEarliest] = useState(false);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const endIndex = startIndex + ORDERS_PER_PAGE;
  const { mutate, isLoading } = useRevertOrder();

  const handleDeleteOrder = async (id) => {
    mutate(id);
  };
  const handlePageChange = (_, value) => {
    setCurrentPage(value);
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
    const newOrders = loanOrders.filter(
      (o) =>
        !searchTerm ||
        (filter === 'item' &&
          o.order_items.some((i) =>
            i.item_expiry.item.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
          )) ||
        (filter === 'user' &&
          o.user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (filter === 'loanee' &&
          o.loanee_name.toLowerCase().includes(searchTerm.toLowerCase())),
    );
    setOrdersToDisplay(newOrders);
  }, [filter, searchTerm, loanOrders]);

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
        <Select
          label='Filter by'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value='item'>Item</MenuItem>
          <MenuItem value='loanee'>Loanee</MenuItem>
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
                Return Date
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
              <LoanOrderContent
                key={order.id}
                order={order}
                isMobile={isMobile}
                isLoading={isLoading}
                handleDeleteOrder={handleDeleteOrder}
              />
            );
          })}
        </Box>
        {loanOrders ? (
          <Pagination
            page={currentPage}
            count={Math.ceil(loanOrders.length / ORDERS_PER_PAGE)}
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

LoanOrderList.propTypes = {
  loanOrders: PropTypes.arrayOf(LoanOrderPropType).isRequired,
  refetch: PropTypes.func.isRequired,
};
