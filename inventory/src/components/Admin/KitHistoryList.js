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

import { useRevertHistory } from '../../hooks/mutations';
import { useKitHistory } from '../../hooks/queries';
import { EmptyMessage } from '../EmptyMessage';
import { LoadingSpinner } from '../LoadingSpinner';

import { KitHistoryContent } from './KitHistoryContent';

export const KitHistoryList = () => {
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
  const [filter, setFilter] = useState('kitName');
  const { data: kitHistory, isLoading: dataLoading } = useKitHistory({
    page: currentPage,
    [filter]: searchTerm,
  });
  const [historyToDisplay, setHistoryToDisplay] = useState(kitHistory);
  const { mutate, isLoading } = useRevertHistory();

  const handleDeleteHistory = async (id) => {
    mutate(id);
  };
  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    if (!kitHistory) return;
    setHistoryToDisplay(kitHistory.results);
  }, [kitHistory]);

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
          <MenuItem value='kitName'>Kit</MenuItem>
          <MenuItem value='type'>Type</MenuItem>
          <MenuItem value='loaneeName'>Loanee</MenuItem>
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
            <Grid item xs={3}>
              Type
            </Grid>
            <Grid item xs={4}>
              Date
            </Grid>
            <Grid item xs={3}>
              Kit
            </Grid>
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
          {!dataLoading && historyToDisplay?.length === 0 && (
            <EmptyMessage
              message='There are no histories matching your search parameters'
              fullscreen={false}
            />
          )}
          {!dataLoading &&
            historyToDisplay?.length > 0 &&
            historyToDisplay?.map((history) => {
              return (
                <KitHistoryContent
                  key={history.id}
                  history={history}
                  isMobile={isMobile}
                  isLoading={dataLoading || isLoading}
                  handleDeleteHistory={handleDeleteHistory}
                />
              );
            })}
        </Box>
        {historyToDisplay ? (
          <Pagination
            page={currentPage}
            count={Math.ceil(historyToDisplay.count / 10)}
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
