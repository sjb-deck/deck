import React from 'react';
import {
  TextField,
  Box,
  Select,
  MenuItem,
  Grid,
  useMediaQuery,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

const types = [
  'General',
  'Bandages',
  'Solution',
  'Dressing',
  'Universal Precaution',
];

const AddItemForm = ({ itemFormData, handleFormChange }) => {
  const isSmallScreen = useMediaQuery('(max-width: 300px)');

  return (
    <form>
      <Typography
        sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}
      >
        Add New Item:
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: 3,
          gap: '15px',
          marginRight: '15px',
        }}
      >
        <TextField
          label='Name'
          name='name'
          value={itemFormData.name}
          onChange={handleFormChange}
          required
          helperText='Name of the item'
          variant='standard'
          sx={{
            '& .MuiInputLabel-root': { fontSize: '14px' },
            '& .MuiFormHelperText-root': { color: 'gray', fontSize: '12px' },
          }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Select
            labelId='type-label'
            label='Type'
            name='type'
            value={itemFormData.type}
            onChange={handleFormChange}
            required
            variant='standard'
            sx={{
              '& .MuiInputLabel-root': { fontSize: '14px' },
              marginRight: { xs: '0', sm: '15px' },
              minWidth: '120px',
            }}
          >
            {types.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          <Box sx={{ fontSize: '12px', color: 'gray' }}>
            Item Type or Category
          </Box>
        </Box>

        <TextField
          label='Unit'
          name='unit'
          value={itemFormData.unit}
          onChange={handleFormChange}
          required
          helperText='Metric to measure quantity'
          variant='standard'
          sx={{
            '& .MuiInputLabel-root': { fontSize: '14px' },
            '& .MuiFormHelperText-root': { color: 'gray', fontSize: '12px' },
          }}
        />

        <TextField
          label='Image'
          name='image'
          value={itemFormData.image}
          onChange={handleFormChange}
          helperText='Image URL'
          variant='standard'
          sx={{
            '& .MuiInputLabel-root': { fontSize: '14px' },
            '& .MuiFormHelperText-root': { color: 'gray', fontSize: '12px' },
          }}
        />

        <Grid container spacing={3}>
          <Grid item xs={isSmallScreen ? 12 : 6} sm={6}>
            <TextField
              label='Total Quantity (Open)'
              name='total_quantityopen'
              value={itemFormData.total_quantityopen}
              onChange={handleFormChange}
              type='number'
              required
              helperText='Quantity of opened item for all expiries'
              variant='standard'
              sx={{
                '& .MuiInputLabel-root': { fontSize: '14px' },
                '& .MuiFormHelperText-root': {
                  color: 'gray',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>
          <Grid item xs={isSmallScreen ? 12 : 6} sm={6}>
            <TextField
              label='Total Quantity (Unopened)'
              name='total_quantityunopened'
              value={itemFormData.total_quantityunopened}
              onChange={handleFormChange}
              type='number'
              required
              helperText='Quantity of unopened item for all expiries'
              variant='standard'
              sx={{
                '& .MuiInputLabel-root': { fontSize: '14px' },
                '& .MuiFormHelperText-root': {
                  color: 'gray',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>
          <Grid item xs={isSmallScreen ? 12 : 6} sm={6}>
            <TextField
              label='Min Quantity (Open)'
              name='min_quantityopen'
              value={itemFormData.min_quantityopen}
              onChange={handleFormChange}
              type='number'
              helperText='Minimum quantity for opened item before warning'
              variant='standard'
              sx={{
                '& .MuiInputLabel-root': { fontSize: '14px' },
                '& .MuiFormHelperText-root': {
                  color: 'gray',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>
          <Grid item xs={isSmallScreen ? 12 : 6} sm={6}>
            <TextField
              label='Min Quantity (Unopened)'
              name='min_quantityunopened'
              value={itemFormData.min_quantityunopened}
              onChange={handleFormChange}
              type='number'
              helperText='Minimum quantity for unopened item before warning'
              variant='standard'
              sx={{
                '& .MuiInputLabel-root': { fontSize: '14px' },
                '& .MuiFormHelperText-root': {
                  color: 'gray',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

AddItemForm.propTypes = {
  itemFormData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    total_quantityopen: PropTypes.number.isRequired,
    total_quantityunopened: PropTypes.number.isRequired,
    min_quantityopen: PropTypes.number.isRequired,
    min_quantityunopened: PropTypes.number.isRequired,
  }).isRequired,
  handleFormChange: PropTypes.func.isRequired,
};

export default AddItemForm;
