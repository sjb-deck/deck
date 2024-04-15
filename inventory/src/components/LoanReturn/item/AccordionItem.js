import InfoIcon from '@mui/icons-material/Info';
import { Box, Drawer, Grid, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';

import { DrawerContent } from './DrawerContent';

export const AccordionItem = ({ orderItem }) => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>{orderItem.item_expiry.item.name}</span>
        <Box sx={{ display: 'flex', gap: '4', alignItems: 'center' }}>
          <span>{orderItem.ordered_quantity}</span>
          <IconButton color='primary' onClick={handleDrawerOpen} size='small'>
            <InfoIcon fontSize='small' />
          </IconButton>
        </Box>
      </Box>
      <Drawer
        anchor='bottom'
        open={open}
        onClose={handleDrawerClose}
        sx={{
          '& .MuiDrawer-paper': {
            height: '330px', // Set the desired height
            overflow: 'auto', // Enable vertical scrolling
          },
        }}
      >
        <DrawerContent
          item={orderItem.item_expiry.item}
          itemExpiry={orderItem.item_expiry.expiry_date}
          orderedQuantity={orderItem.ordered_quantity}
        />
      </Drawer>
    </Box>
  );
};
