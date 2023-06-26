import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import React from 'react';

const ItemPotentialMatchDialog = ({ open, onClose, match, setActiveStep }) => {
  const handleMistake = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{ color: 'orange', fontSize: '18px', fontWeight: 'bold' }}
      >
        Warning!
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Item name is similar to{' '}
          <span style={{ color: 'orange' }}>{match}</span>. Ensure that you are
          not adding an item that already exists!
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: '15px' }}>
        <Button
          sx={{
            fontSize: '0.8rem',
            padding: '4px',
            border: '1px solid #8F8',
            color: '#8F8',
          }}
          onClick={handleMistake}
        >
          That might be a mistake
        </Button>
        <Button
          sx={{
            fontSize: '0.8rem',
            padding: '4px',
            border: '1px solid #CCC',
            color: '#CCC',
          }}
          onClick={onClose}
        >
          The item is correct
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ItemPotentialMatchDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  match: PropTypes.string.isRequired,
  setActiveStep: PropTypes.func.isRequired,
};

export default ItemPotentialMatchDialog;
