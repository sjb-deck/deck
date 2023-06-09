import React, { useState } from 'react';
import PropTypes from 'prop-types';

const types = [
  'General',
  'Bandages',
  'Solution',
  'Dressing',
  'Universal Precaution',
];

const SearchFilter = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState(['All']);
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
    <div>
      <div
        style={{
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          display: 'flex',
          marginBottom: '10px',
        }}
      >
        <button
          style={{
            padding: '5px 10px',
            marginRight: '5px',
            background: selectedFilter.includes('All')
              ? 'dimgrey'
              : 'transparent',
            borderRadius: '10px',
            color: 'white',
          }}
          onClick={() => handleTypeSelection('All')}
        >
          All
        </button>
        {types.map((type) => (
          <button
            key={type}
            style={{
              padding: '5px 10px',
              marginRight: '5px',
              background: selectedFilter.includes(type)
                ? 'dimgrey'
                : 'transparent',
              borderRadius: '15px',
              color: 'white',
            }}
            onClick={() => handleTypeSelection(type)}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

SearchFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default SearchFilter;
