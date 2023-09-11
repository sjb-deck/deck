import InfoIcon from '@mui/icons-material/Info';
import { Box, Drawer, Grid, IconButton, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import DrawerContent from './DrawerContent';

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
          <Typography variant='body2'>{orderItem.name}</Typography>
        </Grid>
        <Grid item xs={2}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              fill='currentColor'
              className='bi bi-dropbox'
              viewBox='0 0 16 16'
              style={{ marginRight: '5px' }}
            >
              <path d='M8.01 4.555 4.005 7.11 8.01 9.665 4.005 12.22 0 9.651l4.005-2.555L0 4.555 4.005 2 8.01 4.555Zm-4.026 8.487 4.006-2.555 4.005 2.555-4.005 2.555-4.006-2.555Zm4.026-3.39 4.005-2.556L8.01 4.555 11.995 2 16 4.555 11.995 7.11 16 9.665l-4.005 2.555L8.01 9.651Z' />
            </svg>
            <Typography variant='body2'>{orderItem.quantity_opened}</Typography>
          </span>
        </Grid>
        <Grid item xs={2}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              fill='currentColor'
              className='bi bi-dropbox'
              viewBox='0 0 16 16'
              style={{ marginRight: '5px' }}
            >
              <path d='M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.01-.003.268-.108a.75.75 0 0 1 .558 0l.269.108.01.003 6.97 2.789ZM10.404 2 4.25 4.461 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339L8 5.961 5.596 5l6.154-2.461L10.404 2Z' />
            </svg>
            <Typography variant='body2'>
              {orderItem.quantity_unopened}
            </Typography>
          </span>
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
        <DrawerContent item={orderItem} />
      </Drawer>
    </Box>
  );
};

AccordionItem.propTypes = {
  orderItem: PropTypes.shape({
    name: PropTypes.string.isRequired,
    quantity_opened: PropTypes.number.isRequired,
    quantity_unopened: PropTypes.number.isRequired,
    // Add other prop types here as needed for orderItem object
  }).isRequired,
};
