import { ArrowDropDownCircleOutlined } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
  Button,
  Modal,
  Typography,
  Backdrop,
  Fade,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Stack,
  Menu,
  MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';
import { PropTypes } from 'prop-types';
import React, { useState } from 'react';
import * as yup from 'yup';

import {
  CART_ITEM_TYPE_DEPOSIT,
  CART_ITEM_TYPE_WITHDRAW,
  ItemPropType,
  LOCAL_STORAGE_CART_KEY,
} from '../../globals';

const CartPopupModal = ({ type, item, selector }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openSelector = Boolean(anchorEl);

  const validationSchema = yup.object({
    openedQty: yup
      .number('Enter a number for opened quantity')
      .min(0, 'Number cannot be negative')
      .required('This field is required'),
    unopenedQty: yup
      .number('Enter a number for unopened quantity')
      .min(0, 'Number cannot be negative')
      .required('This field is required'),
  });

  const formik = useFormik({
    initialValues: {
      openedQty: 0,
      unopenedQty: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.openedQty == 0 && values.unopenedQty == 0) {
        handleClose();
        return;
      }
      const isDeposit = type == 'Deposit';
      const cartItem = {
        ...item,
        type: isDeposit ? CART_ITEM_TYPE_DEPOSIT : CART_ITEM_TYPE_WITHDRAW,
        cartOpenedQuantity: formik.values.openedQty,
        cartUnopenedQuantity: formik.values.unopenedQty,
      };
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItem));
      handleClose();
    },
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSelector = () => {
    setAnchorEl(null);
  };

  const hasExpiry = item.expirydates.length > 0;
  const showDropdown = hasExpiry && item.expirydates.length > 1;
  const preselectedExpiry = !hasExpiry
    ? 'No Expiry'
    : selector == 'All'
    ? item.expirydates[0].expirydate
    : item.expirydates.find((itemExpiry) => itemExpiry.id == selector)
        .expirydate;
  const [selectedExpiry, setSelectedExpiry] = useState(preselectedExpiry);

  return (
    <>
      <Button
        size='small'
        variant='contained'
        color={type == 'Deposit' ? 'success' : 'error'}
        onClick={handleOpen}
      >
        {type}
      </Button>

      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Stack
            spacing={2}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              boxShadow: 24,
              bgcolor: 'background.paper',
              p: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              '& > :last-child': {
                marginTop: 5,
              },
            }}
          >
            {item.imgpic ? (
              <Avatar
                alt={`${item.name}`}
                src={`${item.imgpic}`}
                sx={{ width: 90, height: 90 }}
              />
            ) : (
              <img
                src='/static/inventory/img/logo.png'
                width={90}
                height={90}
              />
            )}
            <Typography id='transition-modal-title' variant='h4' component='h2'>
              {item.name}
            </Typography>
            <Chip
              label={selectedExpiry}
              role='chip'
              aria-label={selectedExpiry}
              aria-controls={openSelector ? 'fade-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={openSelector ? 'true' : undefined}
              onClick={handleClick}
              deleteIcon={
                showDropdown ? <ArrowDropDownCircleOutlined /> : undefined
              }
              onDelete={showDropdown ? handleClick : undefined}
            />
            {showDropdown && (
              <Menu
                id='fade-menu'
                MenuListProps={{
                  'aria-labelledby': 'fade-button',
                }}
                anchorEl={anchorEl}
                open={openSelector}
                onClose={handleCloseSelector}
                TransitionComponent={Fade}
              >
                {item.expirydates.map((itemExpiry) => {
                  return (
                    <MenuItem
                      key={itemExpiry.expirydate}
                      onClick={() => {
                        setSelectedExpiry(itemExpiry.expirydate);
                        handleCloseSelector();
                      }}
                    >
                      {itemExpiry.expirydate}
                    </MenuItem>
                  );
                })}
              </Menu>
            )}

            <TextField
              id='filled-basic'
              type='number'
              label='Opened Qty'
              variant='filled'
              name='openedQty'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>{item.unit}</InputAdornment>
                ),
              }}
              value={formik.values.openedQty}
              onChange={formik.handleChange}
              error={
                formik.touched.openedQty && Boolean(formik.errors.openedQty)
              }
              helperText={formik.touched.openedQty && formik.errors.openedQty}
            />
            <TextField
              id='filled-basic'
              type='number'
              label='Unopened Qty'
              variant='filled'
              name='unopenedQty'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>{item.unit}</InputAdornment>
                ),
              }}
              value={formik.values.unopenedQty}
              onChange={formik.handleChange}
              error={
                formik.touched.unopenedQty && Boolean(formik.errors.unopenedQty)
              }
              helperText={
                formik.touched.unopenedQty && formik.errors.unopenedQty
              }
            />
            {type == 'Deposit' ? (
              <Button
                variant='contained'
                color='success'
                endIcon={<AddCircleIcon />}
                onClick={formik.handleSubmit}
              >
                Deposit
              </Button>
            ) : (
              <Button
                variant='contained'
                color='error'
                endIcon={<RemoveCircleIcon />}
                onClick={formik.handleSubmit}
              >
                Withdraw
              </Button>
            )}
          </Stack>
        </Fade>
      </Modal>
    </>
  );
};

CartPopupModal.propTypes = {
  type: PropTypes.string.isRequired,
  item: ItemPropType.isRequired,
  selector: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired,
  ]),
};

export default CartPopupModal;
