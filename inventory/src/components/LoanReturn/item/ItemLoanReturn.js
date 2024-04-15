import {
  Accordion,
  AccordionSummary,
  Box,
  FormControl,
  Grid,
  MenuItem,
  Pagination,
  InputAdornment,
  Select,
  Skeleton,
  Stack,
  TextField,
  InputLabel,
} from '@mui/material';
import React, { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useActiveLoans } from '../../../hooks/queries';
import { EmptyMessage } from '../../EmptyMessage';
import { LoadingSpinner } from '../../LoadingSpinner';

import { FullAccordion } from './FullAccordion';

export const ItemLoanReturn = () => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: loans,
    isLoading: loansLoading,
    isError: loansError,
  } = useActiveLoans(currentPage);
  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  if (loansLoading) {
    return <LoadingSpinner />;
  }

  if (!loansLoading && !loans && !loansError) {
    return <EmptyMessage message='There are currently no active loans' />;
  }

  if (!loans)
    return (
      <Skeleton>
        <Pagination />
      </Skeleton>
    );

  return (
    <>
      <Box
        className='dynamic-width'
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 1,
          gap: 2,
        }}
      ></Box>
      <Accordion
        expanded={false}
        className='view-table-header'
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
              Return Date
            </Grid>
            <Grid item xs={isMobile ? 5 : 4}>
              Loan Date
            </Grid>
            {!isMobile && (
              <Grid item xs={3}>
                Loanee Name
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
          {loans.results.map((loan, index) => (
            <FullAccordion
              key={index}
              index={(index + 1).toString() + '.'}
              loan={loan}
              isMobile={isMobile}
            />
          ))}
        </Box>
        <Pagination
          page={currentPage}
          count={loans.num_pages}
          onChange={handlePageChange}
          sx={{ paddingTop: 2 }}
        />
      </Stack>
    </>
  );
};
