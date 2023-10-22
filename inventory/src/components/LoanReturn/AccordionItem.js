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
      <Grid container spacing={2}>
        <Grid item xs={4.5} sx={{ marginLeft: '42px', padding: '10px' }}>
          <Typography variant='body2'>
            {orderItem.item_expiry.item.name}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant='body2'>
            Quantity: {orderItem.ordered_quantity}
          </Typography>
        </Grid>
        <Grid item sx={{ marginTop: '-5px', marginRight: '-8px' }}>
          <IconButton color='primary' onClick={handleDrawerOpen} size='small'>
            <InfoIcon fontSize='small' />
          </IconButton>
        </Grid>
      </Grid>
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
