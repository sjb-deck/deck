/**
 * A React component that is renders the search bar
 * @returns SearchBar
 */
import { TextField } from '@mui/material';
import React, { useState } from 'react';

export const SearchBar = ({ callback }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <TextField
      className='dynamic-width'
      label='Search...'
      value={searchTerm}
      onChange={(event) => {
        setSearchTerm(event.target.value);
        if (!!callback) callback(event.target.value);
      }}
    />
  );
};
