/**
 * A React component that is renders the search bar
 * @returns SearchBar
 */
import React, {useEffect, useState} from 'react';
import {TextField, Typography, ListItemText, Avatar, Grid, Autocomplete} from '@mui/material';

const PLACEHOLDER_IMAGE = 'https://cdn4.buysellads.net/uu/1/127419/1670531697-AdobeTeams.jpg'

const SearchResultItem = ({item}) => (
    <Grid container spacing={1} alignItems="center">
        <Grid item>
            <Avatar src={item.imgpic} alt={item.name} />
        </Grid>
        <Grid item xs={3}>
            <ListItemText
                primary={item.name}
                secondary={item.type}
            />
        </Grid>
        <Grid item xs={3}>
            <ListItemText
                primary={item.total_quantityopen}
                secondary={item.total_quantityunopened}
            />
        </Grid>
    </Grid>
);

const SearchBar = ({items}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        console.log(items)
        const parsedData = items.map(item => ({
            id: item.id,
            name: item.name,
            type: item.type,
            imgpic: item.imgpic === '' ? PLACEHOLDER_IMAGE : item.imgpic,
            total_quantityopen: item.total_quantityopen,
            total_quantityunopened: item.total_quantityunopened
        }))

        setData(parsedData);
    },[]);

    const filteredResults = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Autocomplete
                options={filteredResults.slice(0, 5)}
                getOptionLabel={(item) => item.name}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search"
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
        </div>
    )
};

export default SearchBar;
