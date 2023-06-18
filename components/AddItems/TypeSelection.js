import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const TypeSelection = ({ addType, handleAddTypeSelection }) => {
  return (
    <div>
      <Typography style={{ fontSize: '14px' }}>
        Select Type of Addition
      </Typography>
      <Box sx={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <Button
          variant={addType === 'item' ? 'contained' : 'outlined'}
          size='small'
          color='primary'
          onClick={() => handleAddTypeSelection('item')}
          style={{
            borderColor: addType === 'item' ? 'green' : '',
            backgroundColor: addType === 'item' ? 'green' : '',
            color: addType === 'item' ? 'white' : '',
            '&:hover': {
              borderColor: addType === 'item' ? 'darkgreen' : '',
              backgroundColor: addType === 'item' ? 'darkgreen' : '',
            },
          }}
        >
          New Item
        </Button>
        <Button
          variant={addType === 'expiry' ? 'contained' : 'outlined'}
          size='small'
          color='primary'
          onClick={() => handleAddTypeSelection('expiry')}
          style={{
            borderColor: addType === 'expiry' ? 'green' : '',
            backgroundColor: addType === 'expiry' ? 'green' : '',
            color: addType === 'expiry' ? 'white' : '',
            '&:hover': {
              borderColor: addType === 'expiry' ? 'darkgreen' : '',
              backgroundColor: addType === 'expiry' ? 'darkgreen' : '',
            },
          }}
        >
          New Expiry
        </Button>
      </Box>
    </div>
  );
};

TypeSelection.propTypes = {
  addType: PropTypes.oneOf(['item', 'expiry']).isRequired,
  handleAddTypeSelection: PropTypes.func.isRequired,
};

export default TypeSelection;
