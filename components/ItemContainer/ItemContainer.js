import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Avatar, Box, Chip } from '@mui/material';
import { MEDIA_ROOT, ItemPropType } from '../../globals';
import CartPopupModal from '../CartPopupModal/CartPopupModal';

/**
 * A React component that is used to show each individual item card
 * @returns Item container
 */

const ItemContainer = ({ index, item }) => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [selectedExpiry, setSelectedExpiry] = useState('All');
  const getTotalQty = ({ quantityopen, quantityunopened }) =>
    quantityopen + quantityunopened;
  const handleExpiryChange = (itemExpiry) => {
    setSelectedExpiry(itemExpiry == 'All' ? itemExpiry : itemExpiry.id);
  };
  return (
    <Paper
      key={index}
      elevation={3}
      sx={{
        minWidth: '20vw',
        width: { xs: '90%', sm: '70%', md: '50%', lg: '40%', xl: '30%' },
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
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
              src={`${MEDIA_ROOT}${item.imgpic}`}
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
            type='Deposit'
            item={item}
            selector={selectedExpiry}
          />
          <CartPopupModal
            type='Withdraw'
            item={item}
            selector={selectedExpiry}
          />
        </Stack>
      </Stack>
    </Paper>
  );
};

ItemContainer.propTypes = {
  index: PropTypes.number.isRequired,
  item: ItemPropType.isRequired,
};

export default ItemContainer;
