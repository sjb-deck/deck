import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import ItemContainer from '/components/ItemContainer/ItemContainer';
import Theme from '/components/Themes';
import NavBar from '/components/NavBar/NavBar';
import Footer from '/components/Footer';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import SearchBar from '../../../components/SearchBar';
import SearchFilter from '../../../components/SearchFilter';
import { ITEMS_PER_PAGE } from '../../../globals';

export const user = JSON.parse(htmlDecode(userInfo))[0];
export const items = JSON.parse(htmlDecode(allItems));

const ItemIndex = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState(['All']);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const itemsToDisplay = items
    .filter(
      (item) =>
        selectedFilter.includes('All') || selectedFilter.includes(item.type),
    )
    .slice(startIndex, endIndex);

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  return (
    <Theme>
      <NavBar user={user} />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
        <SearchBar items={items} selectedFilter={selectedFilter} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
        <SearchFilter onFilterChange={handleFilterChange} />
      </div>

      <Stack
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={3}
        sx={{ marginTop: 1 }}
      >
        {itemsToDisplay.map((item, index) => {
          return <ItemContainer key={index} index={index} item={item} />;
        })}
        <Pagination
          page={currentPage}
          count={Math.ceil(items.length / ITEMS_PER_PAGE)}
          onChange={handlePageChange}
        />
      </Stack>
      <Footer />
    </Theme>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<ItemIndex />);
