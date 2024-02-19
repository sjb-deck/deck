import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Chip, Divider, IconButton, Stack, Typography } from '@mui/material';
import React, { useContext } from 'react';

import { KitCartContext } from '../../providers';
import { Paper } from '../styled';

export const KitCartItem = ({ kitCartItem }) => {
  const { removeItemFromKitCart } = useContext(KitCartContext);

  const handleDeleteCartItem = () => {
    removeItemFromKitCart(kitCartItem.id);
  };
  return (
    <>
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
            <img src='/static/inventory/img/logo.png' width={90} height={90} />
            <Chip
              label={kitCartItem.complete}
              color={`${
                kitCartItem.complete === 'complete' ? 'success' : 'error'
              }`}
              size='small'
            />
          </Stack>

          <Divider orientation='vertical' />

          <Stack justifyContent='center' flexGrow={1} spacing={1}>
            <Typography variant='h5' fontWeight='bold'>
              {kitCartItem.name}
            </Typography>
            <Typography variant='caption'>
              Blueprint: {kitCartItem.blueprint_name}
            </Typography>
          </Stack>

          <IconButton
            data-testid={`${kitCartItem.id}-delete-btn`}
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
