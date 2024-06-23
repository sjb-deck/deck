import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const TypeSelection = ({ addType, handleAddTypeSelection }) => {
  return (
    <div>
      <Typography
        sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}
      >
        Does this item have an expiry date?
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
          No Expiry
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
          Has Expiry
        </Button>
      </Box>
    </div>
  );
};
