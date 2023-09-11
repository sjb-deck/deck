import {
  Box,
  Grid,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import React from 'react';

import { ItemFormDataPropType } from '../../globals';

const types = [
  'General',
  'Bandages',
  'Solution',
  'Dressing',
  'Universal Precaution',
];

export const AddItemForm = ({
  itemFormData,
  handleFormChange,
  itemFormError,
}) => {
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
          helperText={
            itemFormError.name
              ? 'Name of new item'
              : 'Item name must be filled!'
          }
          variant='standard'
          sx={{
            '& .MuiInputLabel-root': {
              fontSize: '14px',
              color: itemFormError.name ? 'red' : 'white',
            },
            '& .MuiFormHelperText-root': {
              color: itemFormError.name ? 'red' : 'gray',
              fontSize: '12px',
            },
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
          helperText={
            itemFormError.unit
              ? 'Units must be filled!'
              : 'Metric to measure quantity'
          }
          variant='standard'
          sx={{
            '& .MuiInputLabel-root': {
              fontSize: '14px',
              color: itemFormError.unit ? 'red' : 'white',
            },
            '& .MuiFormHelperText-root': {
              color: itemFormError.unit ? 'red' : 'gray',
              fontSize: '12px',
            },
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
              helperText={
                itemFormError.total_quantityopen
                  ? 'Quantity must be a non-negative number!'
                  : 'Quantity of opened item for all expiries'
              }
              variant='standard'
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  color: itemFormError.total_quantityopen ? 'red' : 'white',
                },
                '& .MuiFormHelperText-root': {
                  color: itemFormError.total_quantityopen ? 'red' : 'gray',
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
              helperText={
                itemFormError.total_quantityunopened
                  ? 'Quantity must be a non-negative number!'
                  : 'Quantity of unopened item for all expiries'
              }
              variant='standard'
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  color: itemFormError.total_quantityunopened ? 'red' : 'white',
                },
                '& .MuiFormHelperText-root': {
                  color: itemFormError.total_quantityunopened ? 'red' : 'gray',
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
              helperText={
                itemFormError.min_quantityopen
                  ? 'Quantity must be a non-negative number!'
                  : 'Minimum quantity for opened item before warning'
              }
              variant='standard'
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  color: itemFormError.min_quantityopen ? 'red' : 'white',
                },
                '& .MuiFormHelperText-root': {
                  color: itemFormError.min_quantityopen ? 'red' : 'gray',
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
              helperText={
                itemFormError.min_quantityopen
                  ? 'Quantity must be a non-negative number!'
                  : 'Minimum quantity for unopened item before warning'
              }
              variant='standard'
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  color: itemFormError.min_quantityunopened ? 'red' : 'white',
                },
                '& .MuiFormHelperText-root': {
                  color: itemFormError.min_quantityunopened ? 'red' : 'gray',
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
  itemFormData: ItemFormDataPropType.isRequired,
  handleFormChange: PropTypes.func.isRequired,
  itemFormError: PropTypes.shape({
    name: PropTypes.bool.isRequired,
    type: PropTypes.bool.isRequired,
    unit: PropTypes.bool.isRequired,
    image: PropTypes.bool.isRequired,
    total_quantityopen: PropTypes.bool.isRequired,
    total_quantityunopened: PropTypes.bool.isRequired,
    min_quantityopen: PropTypes.bool.isRequired,
    min_quantityunopened: PropTypes.bool.isRequired,
  }).isRequired,
};
