/**
 * A React component that is renders the search bar
 * @returns SearchBar
 */
import React, { useEffect, useState } from 'react';
import {
  TextField,
  Typography,
  ListItemText,
  Avatar,
  Grid,
  Autocomplete,
} from '@mui/material';
import PropTypes from 'prop-types';

const PLACEHOLDER_IMAGE =
  'https://cdn4.buysellads.net/uu/1/127419/1670531697-AdobeTeams.jpg';
const ITEMS_ON_SEARCH_LIST = 5;

const SearchResultItem = ({ item }) => (
  <Grid container spacing={2} alignItems='center' justifyContent='left' paddingLeft={2}>
    <Grid item>
      <Avatar src={item.imgpic} alt={item.name} />
    </Grid>
    <Grid item xs={6}>
      <ListItemText primary={item.name} secondary={item.type} />
    </Grid>
    <Grid item xs={3}>
      <ListItemText
        primary={item.total_quantityopen}
        secondary={item.total_quantityunopened}
      />
    </Grid>
  </Grid>
);

const SearchBar = ({ items, selectedFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    const parsedData = items.map((item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      imgpic: item.imgpic === '' ? PLACEHOLDER_IMAGE : item.imgpic,
      total_quantityopen: item.total_quantityopen,
      total_quantityunopened: item.total_quantityunopened,
    }));

    setData(parsedData);
  }, []);

  const filteredResults = (data, searchTerm) => {
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedFilter.includes('All') || selectedFilter.includes(item.type)),
    );
  };

  return (
      <Autocomplete
        sx={{
            minWidth: '20vw',
            width: { xs: '90%', sm: '70%', md: '55%', lg: '45%', xl: '35%' },
        }}
        options={filteredResults(data, searchTerm).slice(
          0,
          ITEMS_ON_SEARCH_LIST,
        )}
        getOptionLabel={(item) => item.name}
        renderInput={(params) => (
          <TextField
            {...params}
            label='Search'
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
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
};

export default SearchBar;
