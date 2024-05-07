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
import React, { useEffect, useState } from 'react';

import { LoadingSpinner } from '../../';
import { useKitHistory } from '../../../hooks/queries';
import '../../../globals/styles/inventoryBase.scss';

import { KitData } from './KitData';

export const KitReturn = () => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const { data: kitsData, isLoading: dataLoading } = useKitHistory({
    page: currentPage,
    type: 'LOAN',
  });

  const [searchType, setSearchType] = useState('kit');
  const [searchTerm, setSearchTerm] = useState('');
  const [kitsToDisplay, setKitsToDisplay] = useState([]);

  useEffect(() => {
    if (!kitsData) return;
    setNumPages(Math.ceil(parseInt(kitsData.count) / 10));
  }, [kitsData]);

  useEffect(() => {
    if (!kitsData) return;
    const newKits = kitsData.results.filter(
      (k) =>
        !searchTerm ||
        (searchType === 'kit' &&
          k.kit_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (searchType === 'loanee' &&
          k.loan_info.loanee_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())),
    );
    setKitsToDisplay(newKits);
  }, [kitsData, searchType, searchTerm]);

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
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
      <Box
        className='dynamic-width'
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 2,
          justifyContent: 'space-between',
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
                    inputProps={{ 'data-testid': 'kit-select-name' }}
                    onChange={(e) => setSearchType(e.target.value)}
                  >
                    <MenuItem value='kit'>Kit</MenuItem>
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
              Name
            </Grid>
            <Grid item xs={isMobile ? 5 : 4}>
              Loanee Name
            </Grid>
            {!isMobile && (
              <Grid item xs={3}>
                Due Date
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
          {kitsToDisplay.map((kit) => {
            return <KitData key={kit.id} isMobile={isMobile} kit={kit} />;
          })}
        </Box>
        {kitsToDisplay ? (
          <Pagination
            page={currentPage}
            count={numPages}
            onChange={handlePageChange}
          />
        ) : (
          <Skeleton>
            <Pagination />
          </Skeleton>
        )}
      </Stack>
      {dataLoading ? <LoadingSpinner /> : null}
    </Box>
  );
};
