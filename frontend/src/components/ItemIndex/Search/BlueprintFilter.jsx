import { Button, ButtonGroup, useMediaQuery } from '@mui/material';
import { useState } from 'react';

const types = ['View Existing'];

export const BlueprintFilter = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState('Create');
  const isSmallScreen = useMediaQuery('(max-width: 1000px)');
  const handleTypeSelection = (type) => {
    if (type !== selectedFilter) {
      setSelectedFilter(type);
      onFilterChange(type);
    }
  };

  return (
    <ButtonGroup
      variant='text'
      aria-label='text button group'
      size={isSmallScreen ? 'small' : 'medium'}
      className='dynamic-width'
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      <Button
        color={selectedFilter === 'Create' ? 'success' : 'primary'}
        variant={selectedFilter === 'Create' ? 'contained' : 'outlined'}
        onClick={() => handleTypeSelection('Create')}
        sx={{ borderRadius: 0, marginBottom: 1 }}
      >
        Create
      </Button>
      {types.map((type) => (
        <Button
          key={type}
          color={selectedFilter === type ? 'success' : 'primary'}
          variant={selectedFilter === type ? 'contained' : 'outlined'}
          onClick={() => handleTypeSelection(type)}
          sx={{ borderRadius: 0, marginBottom: 1 }}
        >
          {type}
        </Button>
      ))}
    </ButtonGroup>
  );
};
