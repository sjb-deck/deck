import AddIcon from '@mui/icons-material/Add';
import {
  Accordion,
  AccordionSummary,
  Box,
  Grid,
  MenuItem,
  Skeleton,
  Select,
  Stack,
  Pagination,
  TextField,
  IconButton,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useEffect, useState } from 'react';

import { Footer, LoadingSpinner, NavBar } from '../components';
import { KitInfo } from '../components/KitIndex/KitInfo';
import '../globals/styles/inventoryBase.scss';
import { ORDERS_PER_PAGE } from '../globals';
import { useKits, useUser } from '../hooks/queries';

export const KitIndex = () => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { data: userData } = useUser();
  const { data: kitsData, isLoading: dataLoading } = useKits();
  const [kitsToDisplay, setKitsToDisplay] = useState(kitsData);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const endIndex = startIndex + ORDERS_PER_PAGE;

  useEffect(() => {
    if (!kitsData) return;

    const newKits = kitsData.filter(
      (k) =>
        (!searchTerm ||
          k.blueprint_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filter === 'all' || k.complete === filter),
    );
    setKitsToDisplay(newKits);
  }, [kitsData, searchTerm, filter]);

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <NavBar user={userData} />

      <Box
        sx={{
          minHeight: 0.8,
          display: 'flex',
          width: 1,
          marginTop: 10,
        }}
      >
        {dataLoading ? (
          <LoadingSpinner />
        ) : (
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
                  label='Search by Blueprint'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ width: 1 }}
                />
                <Select
                  inputProps={{ 'data-testid': 'kit-select' }}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  sx={{ width: 0.3 }}
                >
                  <MenuItem value='all'>All</MenuItem>
                  <MenuItem value='complete'>Complete</MenuItem>
                  <MenuItem value='incomplete'>Incomplete</MenuItem>
                </Select>
              </Box>
              <IconButton
                onClick={() => (window.location.href = '/inventory/create_kit')}
              >
                <AddIcon />
              </IconButton>
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
                  return <KitInfo key={kit.id} isMobile={isMobile} kit={kit} />;
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
          </Box>
        )}
      </Box>

      <Footer />
    </>
  );
};
