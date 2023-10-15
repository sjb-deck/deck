import { Skeleton, Typography } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import React, { useEffect, useState } from 'react';

import {
  FloatingCart,
  Footer,
  ItemContainer,
  NavBar,
  SearchBar,
  SearchFilter,
} from '../../components';
import { ITEMS_PER_PAGE } from '../../globals';
import { useItems, useUser } from '../../hooks/queries';
import '../../inventory/src/scss/inventoryBase.scss';
import { exampleItem } from '../../mocks/items';

export const ItemIndex = () => {
  const { data: items } = useItems();
  const { data: userData } = useUser();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState(['All']);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsToDisplay, setItemsToDisplay] = useState(items);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (!items) return;
    const newItems = items.filter(
      (item) =>
        (!searchTerm ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedFilter.includes('All') || selectedFilter.includes(item.type)),
    );
    setItemsToDisplay(newItems);
  }, [items, selectedFilter, searchTerm]);

  return (
    <>
      <NavBar user={userData} />
      <Stack
        className='nav-margin-compensate'
        spacing={2}
        sx={{ alignItems: 'center' }}
      >
        <SearchBar callback={setSearchTerm} />
        <SearchFilter onFilterChange={handleFilterChange} />
      </Stack>

      <Stack
        direction='column'
        justifyContent='flex-start'
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
          ? itemsToDisplay.slice(startIndex, endIndex).map((item) => {
              return <ItemContainer key={item.id} item={item} />;
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

      <FloatingCart />

      <Footer />
    </>
  );
};
