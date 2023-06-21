import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, Button, useMediaQuery } from '@mui/material';

const types = [
  'General',
  'Bandages',
  'Solution',
  'Dressing',
  'Universal Precaution',
];

const SearchFilter = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState(['All']);
  const isSmallScreen = useMediaQuery('(max-width: 1000px)');
  const handleTypeSelection = (type) => {
    if (
      type === 'All' &&
      selectedFilter.includes('All') &&
      selectedFilter.length === 1
    ) {
      return; // ensures that at least one filter is active to switch off 'All'
    } else if (type === 'All' && !selectedFilter.includes('All')) {
      setSelectedFilter(['All']);
      onFilterChange(['All']);
      return; // ensures that 'All' is the only filter active when selected
    }

    if (selectedFilter.includes(type)) {
      if (selectedFilter.length === 1) {
        setSelectedFilter(['All']);
        onFilterChange(['All']);
        return; // select 'All' automatically if no other filter is active
      }
      const newFilter = selectedFilter.filter((currType) => currType !== type);
      setSelectedFilter(newFilter);
      onFilterChange(newFilter);
    } else {
      let newFilter = [...selectedFilter, type];
      if (newFilter.includes('All')) {
        newFilter = newFilter.filter((currType) => currType !== 'All');
      } // removes 'All' when at least one other filter is active
      setSelectedFilter(newFilter);
      onFilterChange(newFilter);
    }
  };

  return (
    <ButtonGroup
      variant='text'
      aria-label='text button group'
      size={isSmallScreen ? 'small' : 'medium'}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: { xs: '90%', sm: '70%', md: '70%', lg: '45%', xl: '35%' },
      }}
    >
      <Button
        color={selectedFilter.includes('All') ? 'success' : 'primary'}
        variant={selectedFilter.includes('All') ? 'contained' : 'outlined'}
        onClick={() => handleTypeSelection('All')}
        sx={{ borderRadius: 0, marginBottom: 1 }}
      >
        All
      </Button>
      {types.map((type) => (
        <Button
          key={type}
          color={selectedFilter.includes(type) ? 'success' : 'primary'}
          variant={selectedFilter.includes(type) ? 'contained' : 'outlined'}
          onClick={() => handleTypeSelection(type)}
          sx={{ borderRadius: 0, marginBottom: 1 }}
        >
          {type}
        </Button>
      ))}
    </ButtonGroup>
  );
};

SearchFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default SearchFilter;
