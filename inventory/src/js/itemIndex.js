import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

import { CartProvider } from '../../../components/CartContext';
import Footer from '../../../components/Footer';
import ItemContainer from '../../../components/ItemContainer/ItemContainer';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import NavBar from '../../../components/NavBar/NavBar';
import SearchBar from '../../../components/SearchBar';
import SearchFilter from '../../../components/SearchFilter';
import Theme from '../../../components/Themes';
import {
  INV_API_ITEMS_URL,
  INV_API_USER_URL,
  ITEMS_PER_PAGE,
} from '../../../globals';
import useFetch from '../hooks/use-fetch';

const ItemIndex = () => {
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
  const [userData, setUserData] = useState(user);
  const [isReady, setIsReady] = useState(false);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  useEffect(() => {
    if (!dataLoading && !userLoading && !dataError && !userError) {
      setItemsToDisplay(
        items.filter(
          (item) =>
            selectedFilter.includes('All') ||
            selectedFilter.includes(item.type),
        ),
      );
      setUserData(user);
      setIsReady(true);
    }
  }, [dataLoading, userLoading, dataError, userError]);

  useEffect(() => {
    if (!isReady) return;
    setItemsToDisplay(
      items.filter(
        (item) =>
          selectedFilter.includes('All') || selectedFilter.includes(item.type),
      ),
    );
  }, [selectedFilter]);

  return isReady ? (
    <Theme>
      <CartProvider>
        <NavBar user={userData} />

        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}
        >
          <SearchBar items={items} selectedFilter={selectedFilter} />
        </div>

        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}
        >
          <SearchFilter onFilterChange={handleFilterChange} />
        </div>

        <Stack
          direction='column'
          justifyContent='center'
          alignItems='center'
          spacing={3}
          sx={{ marginTop: 1 }}
        >
          {itemsToDisplay.slice(startIndex, endIndex).map((item, index) => {
            return <ItemContainer key={index} index={index} item={item} />;
          })}
          <Pagination
            page={currentPage}
            count={Math.ceil(itemsToDisplay.length / ITEMS_PER_PAGE)}
            onChange={handlePageChange}
          />
        </Stack>

        <Footer />
      </CartProvider>
    </Theme>
  ) : (
    <LoadingSpinner />
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<ItemIndex />);
