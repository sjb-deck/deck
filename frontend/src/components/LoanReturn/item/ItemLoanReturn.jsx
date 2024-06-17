import {
  Accordion,
  AccordionSummary,
  Box,
  Grid,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  TextField,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from 'react';

import { useActiveLoans } from '../../../hooks/queries';
import { EmptyMessage } from '../../EmptyMessage';
import { LoadingSpinner } from '../../LoadingSpinner';

import { FullAccordion } from './FullAccordion';

export const ItemLoanReturn = () => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState('item');
  const [searchTerm, setSearchTerm] = useState('');
  const [loansToDisplay, setLoansToDisplay] = useState([]);

  const {
    data: loans,
    isLoading: loansLoading,
    isError: loansError,
  } = useActiveLoans(currentPage);
  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    if (!loans) return;
    const newKits = loans.results.filter(
      (k) =>
        !searchTerm ||
        (searchType === 'item' &&
          k.order_items.some((expiry) =>
            expiry.item_expiry.item.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
          )) ||
        (searchType === 'loanee' &&
          k.loanee_name.toLowerCase().includes(searchTerm.toLowerCase())),
    );
    setLoansToDisplay(newKits);
  }, [loans, searchType, searchTerm]);

  if (!loansLoading && !loans && !loansError) {
    return <EmptyMessage message='There are currently no active loans' />;
  }

  return (
    <>
      <Box
        className='dynamic-width'
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 2,
          gap: 3,
        }}
      >
        <Box sx={{ display: 'flex', width: 1 }}>
          <TextField
            label='Search by'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <Select
                    size='small'
                    value={searchType}
                    inputProps={{ 'data-testid': 'item-select-name' }}
                    onChange={(e) => setSearchType(e.target.value)}
                  >
                    <MenuItem value='item'>Item</MenuItem>
                    <MenuItem value='loanee'>Loanee</MenuItem>
                  </Select>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
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
          {loansToDisplay.map((loan, index) => (
            <FullAccordion
              key={index}
              index={(index + 1).toString() + '.'}
              loan={loan}
              isMobile={isMobile}
            />
          ))}
        </Box>
        {loans ? (
          <Pagination
            page={currentPage}
            count={loans.num_pages}
            onChange={handlePageChange}
            sx={{ paddingTop: 2 }}
          />
        ) : (
          <Skeleton>
            <Pagination />
          </Skeleton>
        )}
      </Stack>
      {loansLoading ? <LoadingSpinner /> : null}
    </>
  );
};
