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
import React, { useEffect, useState } from 'react';

import { useRevertOrder } from '../../hooks/mutations';
import { useOrders } from '../../hooks/queries';
import { LoadingSpinner } from '../LoadingSpinner';

import { OrderContent } from './OrderContent';

export const OrderList = () => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [currentPage, setCurrentPage] = useState(1);
  const { data: orders, isLoading: dataLoading } = useOrders(currentPage);
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
          {!dataLoading &&
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
