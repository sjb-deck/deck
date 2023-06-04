import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import ItemContainer from '/components/ItemContainer/ItemContainer';
import Theme from '/components/Themes';
import NavBar from '/components/NavBar/NavBar';
import Footer from '/components/Footer';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';

export const user = JSON.parse(htmlDecode(userInfo))[0];
export const items = JSON.parse(htmlDecode(allItems));

const ITEMS_PER_PAGE = 5;

const ItemIndex = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const itemsToDisplay = items.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  return (
    <Theme>
      <NavBar />
      <Stack
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={5}
        sx={{ marginTop: 10 }}
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
