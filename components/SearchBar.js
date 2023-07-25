/**
 * A React component that is renders the search bar
 * @returns SearchBar
 */
import {
  Autocomplete,
  Avatar,
  Grid,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const ITEMS_ON_SEARCH_LIST = 5;

const SearchResultItem = ({ item }) => (
  <Grid
    container
    spacing={2}
    alignItems='center'
    justifyContent='left'
    paddingLeft={2}
  >
    <Grid item>
      <Avatar src={item.imgpic} alt={item.name} />
    </Grid>
    <Grid item xs={6}>
      <ListItemText primary={item.name} secondary={item.type} />
    </Grid>
    <Grid item xs={3}>
      <ListItemText
        primary={
          <span>
            {item.is_opened ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                className='bi bi-dropbox'
                viewBox='0 0 16 16'
              >
                <path d='M8.01 4.555 4.005 7.11 8.01 9.665 4.005 12.22 0 9.651l4.005-2.555L0 4.555 4.005 2 8.01 4.555Zm-4.026 8.487 4.006-2.555 4.005 2.555-4.005 2.555-4.006-2.555Zm4.026-3.39 4.005-2.556L8.01 4.555 11.995 2 16 4.555 11.995 7.11 16 9.665l-4.005 2.555L8.01 9.651Z' />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                className='bi bi-box-seam-fill'
                viewBox='0 0 16 16'
              >
                <path
                  fillRule='evenodd'
                  d='M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.01-.003.268-.108a.75.75 0 0 1 .558 0l.269.108.01.003 6.97 2.789ZM10.404 2 4.25 4.461 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339L8 5.961 5.596 5l6.154-2.461L10.404 2Z'
                />
              </svg>
            )}
            {' : ' + item.total_quantity}
          </span>
        }
      />
    </Grid>
  </Grid>
);

export const SearchBar = ({ items, selectedFilter, callback }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResults = (data, searchTerm) => {
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedFilter.includes('All') || selectedFilter.includes(item.type)),
    );
  };

  return (
    <Autocomplete
      className='dynamic-width'
      options={filteredResults(items, searchTerm).slice(
        0,
        ITEMS_ON_SEARCH_LIST,
      )}
      getOptionLabel={(item) => item.name}
      renderInput={(params) => (
        <TextField
          {...params}
          label='Search'
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            if (!!callback) callback(event.target.value);
          }}
        />
      )}
      renderOption={(props, item) => (
        <li {...props}>
          <SearchResultItem item={item} />
        </li>
      )}
      noOptionsText={<Typography>No results found.</Typography>}
    />
  );
};

SearchResultItem.propTypes = {
  item: PropTypes.object.isRequired,
};

SearchBar.propTypes = {
  items: PropTypes.array.isRequired,
  selectedFilter: PropTypes.array.isRequired,
  callback: PropTypes.func,
};
