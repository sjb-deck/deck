import { Box, Button, Chip } from '@mui/material';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useContext, useEffect, useState } from 'react';

import {
  CART_ITEM_TYPE_DEPOSIT,
  CART_ITEM_TYPE_WITHDRAW,
} from '../../../globals';
import { CartContext } from '../../../providers';
import { ImageAvatar } from '../../ImageAvatar';
import { Paper } from '../../styled';
import { CartPopupModal } from '../CartPopupModal';

/**
 * A React component that is used to show each individual item card
 * @returns Item container
 */

export const ItemContainer = ({ item }) => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [selectedExpiry, setSelectedExpiry] = useState('All');
  const { cartState } = useContext(CartContext);
  const hasExpiry = !!item.expiry_dates[0].expiry_date;
  const [openModal, setOpenModal] = useState(false);
  const [orderType, setOrderType] = useState('');

  const handleExpiryChange = (itemExpiry) => {
    setSelectedExpiry(itemExpiry == 'All' ? itemExpiry : itemExpiry.id);
  };

  const handleOpen = (orderType) => {
    setOpenModal(true);
    setOrderType(orderType);
  };

  useEffect(() => {
    setSelectedExpiry('All');
  }, [item]);

  return (
    <Paper elevation={3}>
      {hasExpiry && (
        <>
          <Box sx={{ overflow: 'auto' }}>
            <Stack direction='row' spacing={1}>
              <Chip
                label='All'
                color='primary'
                variant={selectedExpiry === 'All' ? 'filled' : 'outlined'}
                onClick={() => handleExpiryChange('All')}
              />
              {item.expiry_dates
                .filter((x) => !x.archived)
                .map((itemExpiry) => {
                  return (
                    <Chip
                      key={itemExpiry.id}
                      label={itemExpiry.expiry_date}
                      color='primary'
                      variant={
                        selectedExpiry === itemExpiry.id ? 'filled' : 'outlined'
                      }
                      onClick={() => handleExpiryChange(itemExpiry)}
                    />
                  );
                })}
            </Stack>
          </Box>
          <Divider
            orientation='horizontal'
            flexItem
            sx={{ marginTop: '2%', marginBottom: '2%' }}
          />
        </>
      )}

      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={{ xs: 1, sm: 2, md: 4 }}
        justifyContent='space-around'
        divider={
          <Divider
            orientation={isMobile ? 'horizontal' : 'vertical'}
            flexItem
          />
        }
      >
        <Stack
          direction='row'
          divider={<Divider orientation='vertical' flexItem />}
          justifyContent='space-around'
          alignItems='center'
          spacing={{ xs: 1, sm: 2, md: 4 }}
        >
          {item.imgpic ? (
            <ImageAvatar
              src={`/get_image/${encodeURIComponent(item.imgpic)}`}
              size={90}
              alt={item.name}
            />
          ) : (
            <img src='/static/inventory/img/logo.png' width={90} height={90} />
          )}

          <Stack justifyContent='center' width={150}>
            <Typography variant='h5' fontWeight='bold'>
              {item.name}
            </Typography>
            <Typography variant='caption'>Unit: {item.unit}</Typography>
            <Typography variant='caption'>
              Quantity:{' '}
              {selectedExpiry == 'All'
                ? item.total_quantity
                : item.expiry_dates.find(
                    (itemExpiry) => itemExpiry.id == selectedExpiry,
                  ).quantity}
            </Typography>
          </Stack>
        </Stack>
        <Stack
          direction={isMobile ? 'row' : 'column'}
          spacing={{ xs: 0, sm: 1, md: 2 }}
          justifyContent='space-evenly'
        >
          <Button
            size='small'
            variant='contained'
            color='success'
            onClick={() => handleOpen(CART_ITEM_TYPE_DEPOSIT)}
            disabled={cartState === CART_ITEM_TYPE_WITHDRAW}
          >
            {CART_ITEM_TYPE_DEPOSIT}
          </Button>

          <Button
            size='small'
            variant='contained'
            color='error'
            onClick={() => handleOpen(CART_ITEM_TYPE_WITHDRAW)}
            disabled={cartState === CART_ITEM_TYPE_DEPOSIT}
          >
            {CART_ITEM_TYPE_WITHDRAW}
          </Button>

          <CartPopupModal
            type={orderType}
            item={item}
            selector={selectedExpiry}
            open={openModal}
            setOpen={setOpenModal}
          />
        </Stack>
      </Stack>
    </Paper>
  );
};
