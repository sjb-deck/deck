import { ArrowDropDownCircleOutlined } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
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
  useTheme,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { PropTypes } from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';

import { ItemPropType } from '../../globals';
import { CART_ITEM_TYPE_DEPOSIT, CART_ITEM_TYPE_WITHDRAW } from '../../globals';
import { addToCart } from '../../utils/cart-utils/addToCart';
import { getCartState } from '../../utils/cart-utils/getCartState';
import { getMaxWithdrawalQty } from '../../utils/cart-utils/getMaxWithdrawalQty';
import { SnackBarAlerts } from '../SnackBarAlerts';

const CartPopupModal = ({ type, item, selector, setCartState, disabled }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const handleOpenConfirmation = () => setOpenConfirmation(true);
  const handleCloseConfirmation = () => setOpenConfirmation(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const handleOpenDatePicker = () => setOpenDatePicker(true);
  const handleCloseDatePicker = () => setOpenDatePicker(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openSelector = Boolean(anchorEl);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const hasExpiry = !!item.expirydates[0].expirydate;
  const [selectedDate, setSelectedDate] = useState('');
  // const showDropdown = hasExpiry && item.expirydates.length > 1;
  const [itemExpiryDates, setItemExpiryDates] = useState([]);
  const theme = useTheme();
  const preselectedExpiryId =
    selector == 'All'
      ? item.expirydates[0].id
      : item.expirydates.find((itemExpiry) => itemExpiry.id == selector).id;
  const [selectedExpiryId, setSelectedExpiryId] = useState(preselectedExpiryId);

  useEffect(() => {
    const preselectedExpiryId =
      selector == 'All'
        ? item.expirydates[0].id
        : item.expirydates.find((itemExpiry) => itemExpiry.id == selector).id;

    setSelectedExpiryId(preselectedExpiryId);
  }, [item, hasExpiry, selector]);

  useEffect(() => {
    console.log(selectedDate);
    if (hasExpiry && type == CART_ITEM_TYPE_DEPOSIT) {
      if (selectedDate === '') {
        setItemExpiryDates([...item.expirydates, 'New']);
      } else {
        console.log('check' + selectedDate);
        setItemExpiryDates([
          ...item.expirydates,
          { id: -100, expirydate: selectedDate },
          'New',
        ]);
      }
    } else {
      setItemExpiryDates(item.expirydates);
    }
  }, [selectedDate]);

  const handleClick = () => {
    const ele = document.getElementById(item);
    setAnchorEl(ele);
  };

  const handleCloseSelector = () => {
    setAnchorEl(null);
  };

  const getExpiryFromId = (expiryId) => {
    return (
      item.expirydates.find((itemExpiry) => itemExpiry.id == expiryId)
        .expirydate || 'No Expiry'
    );
  };

  const [maxOpenedQty, setMaxOpenedQty] = useState(Infinity);
  const [maxUnopenedQty, setMaxUnopenedQty] = useState(Infinity);

  const validationSchema = yup.object({
    openedQty: yup
      .number('Enter a number for opened quantity')
      .min(0, 'Number cannot be negative')
      .max(maxOpenedQty, 'Number cannot be more than that'),
    unopenedQty: yup
      .number('Enter a number for unopened quantity')
      .min(0, 'Number cannot be negative')
      .max(maxUnopenedQty, 'Number cannot be more than that'),
  });

  const formik = useFormik({
    initialValues: {
      openedQty: '',
      unopenedQty: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (values.openedQty == '') {
        values.openedQty = 0;
      }
      if (values.unopenedQty == '') {
        values.unopenedQty = 0;
      }
      if (values.openedQty == 0 && values.unopenedQty == 0) {
        handleClose();
        resetForm();
        return;
      }
      if (getCartState() !== '' && getCartState() !== type) {
        alert("You can't deposit and withdraw at the same time!");
        return;
      }
      const isDeposit = type == CART_ITEM_TYPE_DEPOSIT;

      setCartState(type);
      const cartItem = {
        ...item,
        expiryId: selectedExpiryId,
        type: isDeposit ? CART_ITEM_TYPE_DEPOSIT : CART_ITEM_TYPE_WITHDRAW,
        cartOpenedQuantity: formik.values.openedQty,
        cartUnopenedQuantity: formik.values.unopenedQty,
      };

      addToCart(cartItem);
      setSnackbarOpen(true);

      handleClose();
      resetForm();
    },
  });

  const setMaxQtys = useCallback(
    (expiryId) => {
      const {
        maxOpenedQty: calculatedMaxOpenedQty,
        maxUnopenedQty: calculatedMaxUnopenedQty,
      } = getMaxWithdrawalQty(expiryId, item);
      setMaxOpenedQty(calculatedMaxOpenedQty);
      setMaxUnopenedQty(calculatedMaxUnopenedQty);
    },
    [item],
  );

  const MyActionBar = () => {
    return (
      <DialogActions>
        <Button onClick={handleCloseDatePicker}> Cancel </Button>
        <Button onClick={handleCloseDatePicker}> Ok </Button>
      </DialogActions>
    );
  };

  const updateSelectedDate = (value) => {
    const date = dayjs(value.$d).format('YYYY-MM-DD');
    setSelectedDate(date);
  };

  return (
    <>
      <SnackBarAlerts
        severity='success'
        open={snackbarOpen}
        message='Added to cart'
        onClose={() => setSnackbarOpen(false)}
      />
      <Button
        size='small'
        variant='contained'
        color={type == CART_ITEM_TYPE_DEPOSIT ? 'success' : 'error'}
        onClick={handleOpen}
        disabled={disabled}
      >
        {type}
      </Button>

      <Dialog
        open={openConfirmation}
        onClose={handleCloseConfirmation}
        aria-labelledby='responsive-dialog-title'
      >
        <DialogTitle id='responsive-dialog-title'>
          {'Proceed to deposit item?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Once you submit, the deposit will take effect immediately and will
            hence not be added to your cart. Do you still wish to submit?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseConfirmation}>
            Cancel
          </Button>
          <Button onClick={handleCloseConfirmation} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDatePicker}
        onClose={handleCloseDatePicker}
        aria-labelledby='responsive-dialog-title'
      >
        <DialogTitle id='responsive-dialog-title'>
          {'Pick a new expiry date'}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['StaticDatePicker']}>
              <DemoItem>
                <StaticDatePicker
                  minDate={dayjs()}
                  defaultValue={dayjs()}
                  onChange={(value) => updateSelectedDate(value)}
                  slotProps={{
                    layout: {
                      sx: {
                        display: 'flex',
                        flexDirection: 'column',
                      },
                    },
                  }}
                  slots={{
                    actionBar: MyActionBar,
                  }}
                />
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
        </DialogContent>
      </Dialog>

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
              boxShadow:
                theme.palette.mode === 'light'
                  ? 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px'
                  : 'rgb(255 255 255 / 25%) 0px 54px 55px, rgb(237 228 228 / 12%) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgb(221 205 205 / 17%) 0px 12px 13px, rgb(220 201 201 / 9%) 0px -3px 5px',
              borderRadius: '6px',
              border:
                theme.palette.mode === 'light'
                  ? '1.5px solid #000000c2'
                  : '1.5px solid #ffffffcf',
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
              id={item}
              label={getExpiryFromId(selectedExpiryId)}
              clickable={
                getExpiryFromId(selectedExpiryId) === 'No Expiry' ? false : true
              }
              role='chip'
              aria-label={getExpiryFromId(selectedExpiryId)}
              aria-controls={openSelector ? 'fade-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={openSelector ? 'true' : undefined}
              onClick={handleClick}
              deleteIcon={
                hasExpiry ? <ArrowDropDownCircleOutlined /> : undefined
              }
              onDelete={hasExpiry ? handleClick : undefined}
            />
            {hasExpiry && (
              <Menu
                id='fade-menu'
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                MenuListProps={{
                  'aria-labelledby': 'fade-button',
                }}
                anchorEl={anchorEl}
                open={openSelector}
                onClose={handleCloseSelector}
                TransitionComponent={Fade}
              >
                {itemExpiryDates.map((itemExpiry) => {
                  if (itemExpiry !== 'New') {
                    console.log(itemExpiry.expirydate, itemExpiry.id);
                    return (
                      <MenuItem
                        key={itemExpiry.expirydate}
                        onClick={() => {
                          console.log(itemExpiry.id);
                          if (id !== -100) {
                            setSelectedExpiryId(itemExpiry.id);
                            setMaxQtys(itemExpiry.id);
                            handleCloseSelector();
                          } else {
                            console.log(selectedDate);
                          }
                        }}
                      >
                        <Typography variant='h8'>
                          {itemExpiry.expirydate}
                        </Typography>
                      </MenuItem>
                    );
                  } else {
                    return (
                      <MenuItem
                        key={itemExpiry}
                        onClick={() => {
                          handleOpenDatePicker();
                        }}
                      >
                        <Box
                          display={'flex'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          paddingRight={'10px'}
                          width={'100%'}
                        >
                          <AddIcon />
                          <Typography variant='h8'>{itemExpiry}</Typography>
                        </Box>
                      </MenuItem>
                    );
                  }
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
            {type == CART_ITEM_TYPE_DEPOSIT ? (
              <Button
                variant='contained'
                role='submit-button'
                color='success'
                endIcon={<AddCircleIcon />}
                // onClick={formik.handleSubmit}
                onClick={handleOpenConfirmation}
              >
                Submit
              </Button>
            ) : (
              <Button
                variant='contained'
                role='submit-button'
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
  setCartState: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default CartPopupModal;
