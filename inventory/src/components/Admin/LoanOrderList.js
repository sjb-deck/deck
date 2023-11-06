import { Sort } from '@mui/icons-material';
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
import React, { useState, useEffect } from 'react';

import { useRevertOrder } from '../../hooks/mutations';
import { useLoans } from '../../hooks/queries';
import { LoadingSpinner } from '../LoadingSpinner';

import { LoanOrderContent } from './LoanOrderContent';

export const LoanOrderList = () => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [currentPage, setCurrentPage] = useState(1);
  const { data: loanOrders, isLoading: dataLoading } = useLoans(currentPage);
  const [ordersToDisplay, setOrdersToDisplay] = useState(loanOrders);
  const { mutate, isLoading } = useRevertOrder();
  const handleDeleteOrder = async (id) => {
    mutate(id);
  };
  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    if (!loanOrders) return;
    setOrdersToDisplay(loanOrders.results);
  }, [loanOrders]);

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
          {!dataLoading &&
            ordersToDisplay?.length &&
            ordersToDisplay?.map((order) => {
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
            count={loanOrders.num_pages}
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
