import React from 'react';
import { TextField, Button } from '@mui/material';

const AddExpiryForm = ({ expiryFormData, handleFormChange }) => {
  return (
    <form>
      <TextField
        label='Expiry Date'
        name='expirydate'
        type='date'
        value={expiryFormData.expirydate}
        onChange={handleFormChange}
        required
        InputLabelProps={{
          shrink: true,
        }}
      />
      <br />
      <TextField
        label='Quantity (Open)'
        name='quantityopen'
        value={expiryFormData.quantityopen}
        onChange={handleFormChange}
        type='number'
        required
      />
      <br />
      <TextField
        label='Quantity (Unopened)'
        name='quantityunopened'
        value={expiryFormData.quantityunopened}
        onChange={handleFormChange}
        type='number'
        required
      />
      <br />
      <Button variant='contained' color='primary' type='submit'>
        Submit
      </Button>
    </form>
  );
};

AddExpiryForm.propTypes = {
  expiryFormData: PropTypes.shape({
    expirydate: PropTypes.string.isRequired,
    quantityopen: PropTypes.number.isRequired,
    quantityunopened: PropTypes.number.isRequired,
  }).isRequired,
  handleFormChange: PropTypes.func.isRequired,
};

export default AddExpiryForm;
