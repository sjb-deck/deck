import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {
  Box,
  Button,
  Fab,
  Stack,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import React from 'react';

import {
  URL_INV_ITEMS,
  URL_INV_LOAN_RETURN,
  URL_INV_VIEW_KITS,
  URL_INV_VIEW_ORDERS_LOANS,
} from '../globals';

export const InventoryIndex = () => {
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });
  return (
    <ThemeProvider theme={lightTheme}>
      <Fab
        variant='extended'
        sx={{ position: 'absolute', top: 15, left: 15 }}
        href='/'
      >
        <HomeIcon sx={{ mr: 2 }} />
        Apps
      </Fab>
      <Fab
        variant='extended'
        sx={{ position: 'absolute', top: 15, right: 15 }}
        href={URL_INV_VIEW_ORDERS_LOANS}
      >
        <DashboardIcon />
      </Fab>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          backgroundRepeat: 'repeat',
          backgroundImage: "url('/static/inventory/img/A6.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src='/static/inventory/img/logo.png'
          alt='logo'
          style={{
            width: '150px',
            marginBottom: '20px',
            animation: 'fadeinmovedown 1s forwards',
          }}
        />
        <h1
          style={{
            color: 'black',
            animation: 'fadeinmovedown 1s forwards',
            fontSize: '2rem',
            fontWeight: 'lighter',
          }}
        >
          Welcome to IMS
        </h1>
        <Stack spacing={2} sx={{ pt: 2 }}>
          <Button
            variant='outlined'
            startIcon={<CategoryIcon />}
            href={URL_INV_ITEMS}
            size='large'
            sx={{ fontSize: '1rem', width: '200px' }}
          >
            <Box ml={2}>Items</Box>
          </Button>
          <Button
            variant='outlined'
            size='large'
            startIcon={<MedicalServicesIcon />}
            href={URL_INV_VIEW_KITS}
            sx={{ fontSize: '1rem', width: '200px' }}
          >
            <Box ml={2}>Kits&nbsp;</Box>
          </Button>
          <Button
            variant='outlined'
            size='large'
            startIcon={<KeyboardReturnIcon />}
            href={URL_INV_LOAN_RETURN}
            sx={{ fontSize: '1rem', width: '200px' }}
          >
            <Box ml={2}>Loans</Box>
          </Button>
        </Stack>
      </Box>
      <Fab
        color='primary'
        aria-label='alerts'
        sx={{
          position: 'absolute',
          bottom: 15,
          right: 15,
        }}
      >
        <NotificationsIcon />
      </Fab>
    </ThemeProvider>
  );
};
