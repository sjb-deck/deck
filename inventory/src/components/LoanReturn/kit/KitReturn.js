import { useKits } from '../../../hooks/queries/';
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
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useEffect, useState } from 'react';

import { LoadingSpinner } from '../../';
import { ORDERS_PER_PAGE } from '../../../globals';
import '../../../globals/styles/inventoryBase.scss';

import { KitData } from '../../KitIndex/KitData';

export const KitReturn = () => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const { data: kitsData, isLoading: dataLoading } = useKits({}, 'loaned');
  const [currentPage, setCurrentPage] = useState(1);
  const [completeFilter, setCompleteFilter] = useState('all');
  const [searchType, setSearchType] = useState('kit');
  const [searchTerm, setSearchTerm] = useState('');
  const [kitsToDisplay, setKitsToDisplay] = useState([]);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const endIndex = startIndex + ORDERS_PER_PAGE;

  useEffect(() => {
    if (!kitsData) return;
    const newKits = kitsData.kits.filter(
      (k) =>
        (!searchTerm ||
          (searchType === 'kit' &&
            k.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (searchType === 'blueprint' &&
            k.blueprint_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))) &&
        (completeFilter === 'all' || k.complete === completeFilter),
    );
    setKitsToDisplay(newKits);
  }, [kitsData, searchType, searchTerm, completeFilter]);

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
          marginBottom: 1,
          gap: 2,
        }}
      >
        <FormControl sx={{ width: 1 }}>
          <InputLabel id='filter-complete'>Complete</InputLabel>
          <Select
            labelId='filter-complete'
            label='Complete'
            inputProps={{ 'data-testid': 'kit-select-complete' }}
            value={completeFilter}
            onChange={(e) => setCompleteFilter(e.target.value)}
          >
            <MenuItem value='all'>All</MenuItem>
            <MenuItem value='complete'>Complete</MenuItem>
            <MenuItem value='incomplete'>Incomplete</MenuItem>
          </Select>
        </FormControl>
      </Box>
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
                    <MenuItem value='blueprint'>Blueprint</MenuItem>
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
              Status
            </Grid>
            {!isMobile && (
              <Grid item xs={3}>
                Complete
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
          {kitsToDisplay?.slice(startIndex, endIndex).map((kit) => {
            return <KitData key={kit.id} isMobile={isMobile} kit={kit} />;
          })}
        </Box>
        {kitsToDisplay ? (
          <Pagination
            page={currentPage}
            count={Math.ceil(kitsToDisplay?.length / ORDERS_PER_PAGE)}
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
