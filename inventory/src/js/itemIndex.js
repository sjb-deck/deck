import { Skeleton, Typography } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

import Footer from '../../../components/Footer';
import ItemContainer from '../../../components/ItemContainer/ItemContainer';
import NavBar from '../../../components/NavBar/NavBar';
import SearchBar from '../../../components/SearchBar';
import SearchFilter from '../../../components/SearchFilter';
import { SnackBarAlerts } from '../../../components/SnackBarAlerts';
import Theme from '../../../components/Themes';
import {
  INV_API_ITEMS_URL,
  INV_API_USER_URL,
  ITEMS_PER_PAGE,
} from '../../../globals';
import useFetch from '../hooks/use-fetch';
import { exampleItem } from '../mocks/items';

export const ItemIndex = () => {
  const {
    data: items,
    loading: dataLoading,
    error: dataError,
  } = useFetch(INV_API_ITEMS_URL);
  const {
    data: user,
    loading: userLoading,
    error: userError,
  } = useFetch(INV_API_USER_URL);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState(['All']);
  const [itemsToDisplay, setItemsToDisplay] = useState(items);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [userData, setUserData] = useState(user);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const searchCallback = (searchTerm) => {
    const newItems = items.filter(
      (item) =>
        (!searchTerm ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedFilter.includes('All') || selectedFilter.includes(item.type)),
    );
    setItemsToDisplay(newItems);
  };

  useEffect(() => {
    if (dataError || userError) {
      setSnackbarOpen(true);
    }
    if (!dataLoading && !dataError) {
      setItemsToDisplay(
        items.filter(
          (item) =>
            selectedFilter.includes('All') ||
            selectedFilter.includes(item.type),
        ),
      );
    }
    if (!userLoading && !userError) {
      setUserData(user);
    }
  }, [
    dataLoading,
    userLoading,
    dataError,
    userError,
    items,
    user,
    selectedFilter,
  ]);

  return (
    <Theme>
      <NavBar user={userData} />
      <SnackBarAlerts
        open={snackbarOpen}
        message={dataError?.message || userError?.message}
      />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
        {items ? (
          <SearchBar
            items={items}
            selectedFilter={selectedFilter}
            callback={searchCallback}
          />
        ) : (
          <Skeleton>
            <SearchBar items={[exampleItem]} selectedFilter={selectedFilter} />
          </Skeleton>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
        <SearchFilter onFilterChange={handleFilterChange} />
      </div>

      <Stack
        direction='column'
        justifyContent='space-between'
        alignItems='center'
        spacing={3}
        sx={{
          marginTop: 1,
          minHeight: 0.8,
        }}
      >
        {itemsToDisplay && itemsToDisplay.length === 0 && (
          <Typography
            variant='body1'
            sx={{
              marginTop: '16px',
              fontStyle: 'italic',
            }}
          >
            No results found.
          </Typography>
        )}
        {itemsToDisplay
          ? itemsToDisplay.slice(startIndex, endIndex).map((item, index) => {
              return <ItemContainer key={index} index={index} item={item} />;
            })
          : [...Array(ITEMS_PER_PAGE).keys()].map((index) => (
              <Skeleton key={index} variant='rectangular'>
                <ItemContainer item={exampleItem} />
              </Skeleton>
            ))}
        {itemsToDisplay ? (
          <Pagination
            page={currentPage}
            count={Math.ceil(itemsToDisplay.length / ITEMS_PER_PAGE)}
            onChange={handlePageChange}
          />
        ) : (
          <Skeleton>
            <Pagination />
          </Skeleton>
        )}
      </Stack>

      <Footer />
    </Theme>
  );
};

if (process.env.NODE_ENV !== 'test') {
  const root = ReactDOM.createRoot(document.querySelector('#root'));
  root.render(<ItemIndex />);
}
