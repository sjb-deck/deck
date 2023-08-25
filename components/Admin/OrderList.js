import {
  Accordion,
  AccordionSummary,
  Box,
  Grid,
  Pagination,
  Skeleton,
  Stack,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { PropTypes } from 'prop-types';
import React, { useState } from 'react';

import { OrderPropType, ORDERS_PER_PAGE } from '../../globals';
import { useRevertOrder } from '../../hooks/mutations';

import { OrderContent } from './OrderContent';

export const OrderList = ({ orders }) => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const endIndex = startIndex + ORDERS_PER_PAGE;
  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };
  const { mutate, isLoading } = useRevertOrder();
  const handleDeleteOrder = async (id) => {
    mutate(id);
  };
  return (
    <Box
      sx={{
        width: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
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
              Date
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
          {orders.slice(startIndex, endIndex).map((order) => {
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
