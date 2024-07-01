import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
  Backdrop,
  Box,
  Button,
  Fade,
  InputAdornment,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';

import {
  CART_ITEM_TYPE_DEPOSIT,
  CART_ITEM_TYPE_WITHDRAW,
} from '../../../globals/constants';
import { IMG_LOGO } from '../../../globals/urls';
import { useNewExpiryDate } from '../../../hooks/mutations';
import { AlertContext, CartContext } from '../../../providers';
import { ImageAvatar } from '../../ImageAvatar';

import { ConfirmationDialog, DatePickerDialog } from './Dialogs';
import { getValidationSchema } from './schema';
import { PopupStack } from './styled';

export const CartPopupModal = ({ type, item, selector, open, setOpen }) => {
  const hasExpiry = !!item.expiry_dates[0].expiry_date;
  const showDropdown = hasExpiry && item.expiry_dates.length >= 1;
  const canAddExpiry = type == CART_ITEM_TYPE_DEPOSIT && hasExpiry;
  const disableExpirySelection = !canAddExpiry && !showDropdown;
  const preselectedExpiryId =
    selector == 'All' ? item.expiry_dates[0]?.id : selector;
  const { cartItems, cartState, addToCart } = useContext(CartContext);

  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [tempSelectedDate, setTempSelectedDate] = useState('');
  const [selectedExpiryId, setSelectedExpiryId] = useState(preselectedExpiryId);
  const { setAlert } = useContext(AlertContext);
  const { mutate } = useNewExpiryDate();

  const handleOpenConfirmation = () => setOpenConfirmation(true);
  const handleCloseConfirmation = () => setOpenConfirmation(false);
  const handleOpenDatePicker = () => setOpenDatePicker(true);
  const handleCloseDatePicker = (date) => {
    if (date) {
      setTempSelectedDate(date);
      if (
        item.expiry_dates.find(
          (itemExpiry) =>
            itemExpiry.expiry_date == date && itemExpiry.id !== 'newDate',
        )
      ) {
        alert('Expiry date already exists!');
        return;
      } else {
        setSelectedDate(date);
        setSelectedExpiryId('newDate');
        item.expiry_dates.push({
          id: 'newDate',
          expiry_date: date,
        });
      }
    } else {
      setTempSelectedDate('');
    }
    setOpenDatePicker(false);
  };

  useEffect(() => {
    const preselectedExpiryId =
      selector == 'All'
        ? item.expiry_dates[0].id
        : item.expiry_dates.find((itemExpiry) => itemExpiry.id == selector).id;

    setSelectedExpiryId(preselectedExpiryId);
  }, [item, hasExpiry, selector]);

  const getExpiryFromId = (expiryId) => {
    if (expiryId === 'newDate') {
      return selectedDate;
    }
    return (
      item.expiry_dates.find((itemExpiry) => itemExpiry.id == expiryId)
        .expiry_date || 'No Expiry'
    );
  };

  const addNewExpiry = async () => {
    const data = {
      item: item.id,
      expiry_date: selectedDate,
      quantity: formik.values.quantity,
    };
    mutate(data);
  };

  const formik = useFormik({
    initialValues: {
      quantity: '',
    },
    validationSchema: getValidationSchema(
      type,
      item,
      cartItems,
      selectedExpiryId,
    ),
    onSubmit: async (values) => {
      const isDeposit = type == CART_ITEM_TYPE_DEPOSIT;
      if (isDeposit && selectedExpiryId === 'newDate') {
        addNewExpiry();
        handleClose();
        return;
      }

      if (cartState !== '' && cartState !== type) {
        alert("You can't deposit and withdraw at the same time!");
        return;
      }

      const currCartState = isDeposit
        ? CART_ITEM_TYPE_DEPOSIT
        : CART_ITEM_TYPE_WITHDRAW;
      const cartItem = {
        ...item,
        expiryId: selectedExpiryId,
        type: currCartState,
        cartQuantity: values.quantity,
      };

      addToCart(cartItem);
      setAlert({
        severity: 'success',
        message: `${cartItem.name} added to cart!`,
        autoHide: true,
      });

      handleClose();
    },
  });

  const handleClose = () => {
    setOpen(false);
    setSelectedDate('');
    setSelectedExpiryId(preselectedExpiryId);
    setTempSelectedDate('');
    item.expiry_dates = item.expiry_dates.filter(
      (itemExpiry) => itemExpiry.id !== 'newDate',
    );
    formik.resetForm();
  };

  return (
    <>
      <ConfirmationDialog
        openConfirmation={openConfirmation}
        handleCloseConfirmation={handleCloseConfirmation}
        handleSubmit={formik.handleSubmit}
      />

      <DatePickerDialog
        openDatePicker={openDatePicker}
        handleCloseDatePicker={handleCloseDatePicker}
      />

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
          <PopupStack spacing={2}>
            {item.imgpic ? (
              <ImageAvatar
                alt={item.name}
                src={item.imgpic}
                size={90}
                isS3Image
              />
            ) : (
              <img src={IMG_LOGO} width={90} height={90} />
            )}
            <Typography id='transition-modal-title' variant='h4' component='h2'>
              {item.name}
            </Typography>
            <TextField
              id='filled-select-expiry-date'
              select={showDropdown && (!tempSelectedDate || canAddExpiry)}
              disabled={disableExpirySelection}
              label='Expiry Date'
              value={getExpiryFromId(selectedExpiryId)}
              variant='filled'
              sx={{ width: '80%' }}
            >
              {item.expiry_dates.map((itemExp) => (
                <MenuItem
                  key={itemExp.id}
                  value={itemExp.expiry_date ?? 'No Expiry'}
                  onClick={() => {
                    setSelectedExpiryId(itemExp.id);
                  }}
                >
                  <Typography variant='h8' marginRight={'5px'}>
                    {`${itemExp.expiry_date}` ?? 'No Expiry'}
                  </Typography>
                  {itemExp.id === 'newDate' && (
                    <Typography variant='h8' color='red'>
                      (New)
                    </Typography>
                  )}
                </MenuItem>
              ))}
              {type == CART_ITEM_TYPE_DEPOSIT && (
                <MenuItem
                  key={'new'}
                  value={'new'}
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
                    <Typography variant='h8'>Add Expiry</Typography>
                  </Box>
                </MenuItem>
              )}
            </TextField>
            <TextField
              id='filled-basic'
              type='number'
              label='Quantity'
              variant='filled'
              name='quantity'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>{item.unit}</InputAdornment>
                ),
              }}
              sx={{ width: '80%' }}
              value={formik.values.quantity}
              onChange={formik.handleChange}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={formik.touched.quantity && formik.errors.quantity}
            />

            {type == CART_ITEM_TYPE_DEPOSIT ? (
              <Button
                variant='contained'
                role='submit-button'
                color='success'
                endIcon={<AddCircleIcon />}
                onClick={() => {
                  if (selectedExpiryId === 'newDate') {
                    handleOpenConfirmation();
                  } else {
                    formik.handleSubmit();
                  }
                }}
              >
                Deposit
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
          </PopupStack>
        </Fade>
      </Modal>
    </>
  );
};
