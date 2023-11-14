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
import React, { useState, useEffect, useCallback } from 'react';

import { useRevertOrder } from '../../hooks/mutations';
import { useLoans } from '../../hooks/queries';
import { LoadingSpinner } from '../LoadingSpinner';

import { LoanOrderContent } from './LoanOrderContent';

export const LoanOrderList = () => {
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
  const { data: loanOrders, isLoading: dataLoading } = useLoans({
    page: currentPage,
    [filter]: searchTerm,
  });
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
          label='Filter by'
          inputProps={{ 'data-testid': 'search-select' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value='item'>Item</MenuItem>
          <MenuItem value='loaneeName'>Loanee</MenuItem>
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
              Date
            </Grid>
            {!isMobile && (
              <Grid item xs={3}>
                Return Deadline
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
            ordersToDisplay?.length > 0 &&
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
