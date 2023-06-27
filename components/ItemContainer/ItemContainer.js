import { Avatar, Box, Chip } from '@mui/material';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';

import {
  CART_ITEM_TYPE_DEPOSIT,
  CART_ITEM_TYPE_WITHDRAW,
  ItemPropType,
} from '../../globals';
import { CartContext } from '../CartContext';
import CartPopupModal from '../CartPopupModal/CartPopupModal';
import { Paper } from '../styled';

/**
 * A React component that is used to show each individual item card
 * @returns Item container
 */

const ItemContainer = ({ index, item }) => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [selectedExpiry, setSelectedExpiry] = useState('All');
  const { cartState, setCartState } = useContext(CartContext);

  const getTotalQty = ({ quantityopen, quantityunopened }) =>
    quantityopen + quantityunopened;
  const handleExpiryChange = (itemExpiry) => {
    setSelectedExpiry(itemExpiry == 'All' ? itemExpiry : itemExpiry.id);
  };

  return (
    <Paper key={index} elevation={3}>
      {!item.expirydates.length || (
        <>
          <Box sx={{ overflow: 'auto' }}>
            <Stack direction='row' spacing={1}>
              <Chip
                label='All'
                color='primary'
                variant={selectedExpiry === 'All' ? 'filled' : 'outlined'}
                onClick={() => handleExpiryChange('All')}
              />
              {item.expirydates.map((itemExpiry, index) => {
                return (
                  <Chip
                    key={index}
                    label={itemExpiry.expirydate}
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
            <Avatar
              alt={`${item.name}`}
              src={`${item.imgpic}`}
              sx={{ width: 90, height: 90 }}
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
              Total Qty:{' '}
              {selectedExpiry == 'All'
                ? item.total_quantityopen + item.total_quantityunopened
                : getTotalQty(
                    item.expirydates.find(
                      (itemExpiry) => itemExpiry.id == selectedExpiry,
                    ),
                  )}
            </Typography>
            <Typography variant='caption'>
              Opened Qty:{' '}
              {selectedExpiry == 'All'
                ? item.total_quantityopen
                : item.expirydates.find(
                    (itemExpiry) => itemExpiry.id == selectedExpiry,
                  ).quantityopen}
            </Typography>
            <Typography variant='caption'>
              Unopened Qty:{' '}
              {selectedExpiry == 'All'
                ? item.total_quantityunopened
                : item.expirydates.find(
                    (itemExpiry) => itemExpiry.id == selectedExpiry,
                  ).quantityunopened}
            </Typography>
          </Stack>
        </Stack>
        <Stack
          direction={isMobile ? 'row' : 'column'}
          spacing={{ xs: 0, sm: 1, md: 2 }}
          justifyContent='space-evenly'
        >
          <CartPopupModal
            type={CART_ITEM_TYPE_DEPOSIT}
            item={item}
            selector={selectedExpiry}
            setCartState={setCartState}
            disabled={cartState === CART_ITEM_TYPE_WITHDRAW}
          />

          <CartPopupModal
            type={CART_ITEM_TYPE_WITHDRAW}
            item={item}
            selector={selectedExpiry}
            setCartState={setCartState}
            disabled={cartState === CART_ITEM_TYPE_DEPOSIT}
          />
        </Stack>
      </Stack>
    </Paper>
  );
};

ItemContainer.propTypes = {
  index: PropTypes.number,
  item: ItemPropType.isRequired,
};

export default ItemContainer;
