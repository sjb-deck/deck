import {
  Box,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  Switch,
  TextField,
  useMediaQuery,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import React from 'react';

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
          name='imgpic'
          value={itemFormData.imgpic}
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
              label='Total Quantity'
              name='total_quantity'
              value={itemFormData.total_quantity}
              onChange={handleFormChange}
              type='number'
              required
              helperText={
                itemFormError.total_quantity
                  ? 'Quantity must be a non-negative number!'
                  : 'Quantity of item for all expiries'
              }
              variant='standard'
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  color: itemFormError.total_quantity ? 'red' : 'white',
                },
                '& .MuiFormHelperText-root': {
                  color: itemFormError.total_quantity ? 'red' : 'gray',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>
          <Grid item xs={isSmallScreen ? 12 : 6} sm={6}>
            <TextField
              label='Min Quantity'
              name='min_quantity'
              value={itemFormData.min_quantity}
              onChange={handleFormChange}
              type='number'
              helperText={
                itemFormError.min_quantity
                  ? 'Quantity must be a non-negative number!'
                  : 'Minimum quantity of item before warning'
              }
              variant='standard'
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  color: itemFormError.min_quantity ? 'red' : 'white',
                },
                '& .MuiFormHelperText-root': {
                  color: itemFormError.min_quantity ? 'red' : 'gray',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>
          <Grid item xs={isSmallScreen ? 12 : 6} sm={6}>
            <FormControlLabel
              control={<Switch checked={itemFormData.is_opened} />}
              label={itemFormData.is_opened ? 'Opened' : 'Unopened'}
              labelPlacement='end'
              onChange={handleFormChange}
              name='is_opened'
            />
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};
