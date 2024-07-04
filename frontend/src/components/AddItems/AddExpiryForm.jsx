import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  useMediaQuery,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { IMG_LOGO } from '../../globals/urls';
import { isImage } from '../../utils';
import { ImageAvatar } from '../ImageAvatar';

import { DateAndQuantity } from './DateAndQuantity';

const types = [
  'General',
  'Bandages',
  'Solution',
  'Dressing',
  'Universal Precaution',
];

const MAX_NUMBER_OF_EXPIRY = 5;

export const AddExpiryForm = ({
  expiryFormData,
  handleFormChange,
  expiryFormError,
  setExpiryFormData,
  setExpiryFormError,
}) => {
  const isSmallScreen = useMediaQuery('(max-width: 300px)');

  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  useEffect(() => {
    if (expiryFormData.imgpic.name) {
      // if there is already an image display the image
      const objectUrl = URL.createObjectURL(expiryFormData.imgpic);
      setImagePreviewUrl(URL.createObjectURL(expiryFormData.imgpic));
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      // if there is no image, display the default logo
      setImagePreviewUrl(IMG_LOGO);
    }
  }, [expiryFormData.imgpic]);

  // Handles the file input change
  const onSelectFile = (e) => {
    if (
      !e.target.files ||
      e.target.files.length === 0 ||
      !isImage(e.target.files[0])
    ) {
      return;
    }
    const imageFile = e.target.files[0];
    const processedImageUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(processedImageUrl);
    handleFormChange(e);

    // Revoke the object URL after the image is loaded
    const imgElement = document.getElementById('imgpic');
    imgElement.onload = () => {
      URL.revokeObjectURL(processedImageUrl);
    };
  };

  const handleAddExpiry = () => {
    const exp = expiryFormData.expiry;
    const err = expiryFormError.expiry;
    exp.push({
      expiry_date: dayjs(new Date()).format('YYYY-MM-DD'),
      quantity: 0,
    });
    err.push({
      expiry_date: false,
      quantity: false,
    });
    setExpiryFormData((prev) => ({
      ...prev,
      expiry: exp,
    }));
    setExpiryFormError((prev) => ({
      ...prev,
      expiry: err,
    }));
  };

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
        <ImageAvatar src={imagePreviewUrl} alt='Image preview' size={90} />
        <TextField
          label='Name'
          name='name'
          value={expiryFormData.name}
          onChange={handleFormChange}
          required
          helperText={
            expiryFormError.name
              ? 'Name of new item'
              : 'Item name must be filled!'
          }
          variant='standard'
          sx={{
            '& .MuiInputLabel-root': {
              fontSize: '14px',
              color: expiryFormError.name ? 'red' : 'white',
            },
            '& .MuiFormHelperText-root': {
              color: expiryFormError.name ? 'red' : 'gray',
              fontSize: '12px',
            },
          }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Select
            labelId='type-label'
            label='Type'
            name='type'
            value={expiryFormData.type}
            onChange={handleFormChange}
            required
            variant='standard'
            sx={{
              '& .MuiInputLabel-root': { fontSize: '14px' },
              marginRight: { xs: '0', sm: '15px' },
              minWidth: '120px',
            }}
            data-testid='type-select'
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
          value={expiryFormData.unit}
          onChange={handleFormChange}
          required
          helperText={
            expiryFormError.unit
              ? 'Units must be filled!'
              : 'Metric to measure quantity'
          }
          variant='standard'
          sx={{
            '& .MuiInputLabel-root': {
              fontSize: '14px',
              color: expiryFormError.unit ? 'red' : 'white',
            },
            '& .MuiFormHelperText-root': {
              color: expiryFormError.unit ? 'red' : 'gray',
              fontSize: '12px',
            },
          }}
        />

        <div style={{ margin: '10px 0' }}>
          {expiryFormData.expiry.map((item, index) => {
            return (
              <DateAndQuantity
                key={index}
                expiryFormData={expiryFormData}
                setExpiryFormData={setExpiryFormData}
                expiryFormError={expiryFormError}
                setExpiryFormError={setExpiryFormError}
                index={index}
              />
            );
          })}
          {expiryFormData.expiry.length >= MAX_NUMBER_OF_EXPIRY ? null : (
            <Button
              variant='outlined'
              color='success'
              onClick={handleAddExpiry}
              sx={{
                height: '25px',
                lineHeight: '25px',
                width: '100%',
                marginTop: '10px',
                fontSize: '10px',
              }}
            >
              Add
            </Button>
          )}
        </div>

        <FormControl variant='standard'>
          <InputLabel htmlFor='imgpic'>Image</InputLabel>
          <Input
            id='imgpic'
            name='imgpic'
            type='file'
            accept='image/*'
            onChange={onSelectFile}
          />
          <FormHelperText>Upload Image</FormHelperText>
        </FormControl>

        <Grid container spacing={3}>
          <Grid item xs={isSmallScreen ? 12 : 6} sm={6}>
            <TextField
              label='Min Quantity'
              name='min_quantity'
              value={expiryFormData.min_quantity}
              onChange={handleFormChange}
              type='number'
              helperText={
                expiryFormError.min_quantity
                  ? 'Quantity must be a non-negative number!'
                  : 'Minimum quantity for opened item before warning'
              }
              variant='standard'
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  color: expiryFormError.min_quantity ? 'red' : 'white',
                },
                '& .MuiFormHelperText-root': {
                  color: expiryFormError.min_quantity ? 'red' : 'gray',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>
          <Grid item xs={isSmallScreen ? 12 : 6} sm={6}>
            <FormControlLabel
              control={<Switch checked={expiryFormData.is_opened} />}
              label={expiryFormData.is_opened ? 'Opened' : 'Unopened'}
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
