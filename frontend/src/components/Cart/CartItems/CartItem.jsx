import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  Button,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useContext, useState } from 'react';

import { IMG_LOGO } from '../../../globals/urls';
import { CartContext } from '../../../providers';
import { ImageAvatar } from '../../ImageAvatar';
import { Paper } from '../../styled';
import { EditCartItemPopUp } from '../EditPopUp/EditCartItemPopUp';

export const CartItem = ({ cartItem }) => {
  const expiryDate =
    cartItem.expiry_dates.find((expiry) => expiry.id === cartItem.expiryId)
      .expiry_date || 'No Expiry';

  const { removeItemFromCart } = useContext(CartContext);
  const [popupOpen, setPopupOpen] = useState(false);

  const handleDeleteCartItem = () => {
    removeItemFromCart(cartItem.expiryId);
  };

  const handleEditPopUpOpen = () => {
    setPopupOpen(true);
  };

  const handleEditPopUpClose = () => {
    setPopupOpen(false);
  };

  return (
    <>
      <EditCartItemPopUp
        cartItem={cartItem}
        open={popupOpen}
        handleClose={handleEditPopUpClose}
      />
      <Paper style={{ width: '100%' }} elevation={3}>
        <Stack
          direction='row'
          spacing={2}
          justifyContent='center'
          alignItems='center'
        >
          <Stack
            direction='column'
            justifyContent='center'
            alignItems='center'
            spacing={1}
          >
            {cartItem.imgpic ? (
              <ImageAvatar
                alt={cartItem.name}
                src={cartItem.imgpic}
                size={90}
                isS3Image
              />
            ) : (
              <img src={IMG_LOGO} width={90} height={90} />
            )}

            <Chip label={expiryDate} color='primary' size='small' />
          </Stack>

          <Divider orientation='vertical' />

          <Stack justifyContent='center' flexGrow={1} spacing={1}>
            <Typography variant='h5' fontWeight='bold'>
              {cartItem.name}
            </Typography>
            <Typography variant='caption'>
              Quantity: {cartItem.cartQuantity}
            </Typography>
            <Button
              variant='outlined'
              size='small'
              startIcon={<EditIcon fontSize='inherit' />}
              style={{ width: '100px' }}
              onClick={handleEditPopUpOpen}
            >
              Edit
            </Button>
          </Stack>

          <IconButton
            aria-label='delete'
            size='medium'
            onClick={handleDeleteCartItem}
          >
            <HighlightOffIcon fontSize='inherit' />
          </IconButton>
        </Stack>
      </Paper>
    </>
  );
};
