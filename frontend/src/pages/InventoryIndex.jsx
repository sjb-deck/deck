import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import LogoutIcon from '@mui/icons-material/Logout';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Badge,
  Box,
  Stack,
  ThemeProvider,
  Tooltip,
  Typography,
  createTheme,
  useMediaQuery,
} from '@mui/material';
import { useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useNavigate } from 'react-router-dom';

import {
  IMG_LOGO,
  IMG_SPLASH,
  IMG_USER,
  URL_INV_ITEMS,
  URL_INV_LOAN_RETURN,
  URL_INV_VIEW_KITS,
  URL_INV_VIEW_ORDERS_LOANS,
  URL_PROFILE,
} from '../globals/urls';
import { useSignOutDeck } from '../hooks/auth';
import { stringAvatar } from '../utils';

export const InventoryIndex = () => {
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1e1e1e',
        light: '#484848',
        dark: '#000000',
        contrastText: '#fff',
      },
    },
  });
  const user = useAuthUser();
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <ThemeProvider theme={lightTheme}>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          backgroundRepeat: 'repeat',
          backgroundImage: `url(${IMG_SPLASH})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <InventoryIndexUserCard user={user} isMobile={isMobile} />

        <img
          src={IMG_LOGO}
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
        <InventoryIndexOptions />
      </Box>
    </ThemeProvider>
  );
};

export const InventoryIndexOptions = () => {
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingKits, setLoadingKits] = useState(false);
  const [loadingLoans, setLoadingLoans] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const navigate = useNavigate();
  return (
    <Stack spacing={2} sx={{ pt: 2 }}>
      <LoadingButton
        variant='outlined'
        startIcon={<CategoryIcon />}
        onClick={() => {
          setLoadingItems(true);
          navigate(URL_INV_ITEMS);
        }}
        size='large'
        loading={loadingItems}
        loadingPosition='end'
        sx={{ fontSize: '1rem', width: '200px' }}
      >
        <Box ml={2}>Items</Box>
      </LoadingButton>
      <LoadingButton
        variant='outlined'
        startIcon={<MedicalServicesIcon />}
        onClick={() => {
          setLoadingKits(true);
          navigate(URL_INV_VIEW_KITS);
        }}
        size='large'
        loading={loadingKits}
        loadingPosition='end'
        sx={{ fontSize: '1rem', width: '200px' }}
      >
        <Box ml={2}>Kits&nbsp;</Box>
      </LoadingButton>
      <LoadingButton
        variant='outlined'
        startIcon={<KeyboardReturnIcon />}
        onClick={() => {
          setLoadingLoans(true);
          navigate(URL_INV_LOAN_RETURN);
        }}
        size='large'
        loading={loadingLoans}
        loadingPosition='end'
        sx={{ fontSize: '1rem', width: '200px' }}
      >
        <Box ml={2}>Loans</Box>
      </LoadingButton>
      <Stack direction='row' spacing={1} sx={{ justifyContent: 'center' }}>
        <LoadingButton
          variant='contained'
          size='large'
          onClick={() => {
            setLoadingDashboard(true);
            navigate(URL_INV_VIEW_ORDERS_LOANS);
          }}
          loading={loadingDashboard}
          loadingPosition='end'
          sx={{ width: '50%' }}
        >
          <DashboardIcon />
        </LoadingButton>
        <LoadingButton
          variant='contained'
          size='large'
          aria-label='alerts'
          onClick={() => {
            setLoadingNotifications(true);
            // Add the action for the notifications button here
          }}
          loading={loadingNotifications}
          loadingPosition='end'
          sx={{ width: '50%' }}
        >
          <Badge badgeContent={1} color='error'>
            <NotificationsIcon />
          </Badge>
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export const InventoryIndexUserCard = ({ user, isMobile }) => {
  const mobileStyle = {
    position: 'absolute',
    top: 15,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '10px',
    paddingBottom: '10px',
    boxShadow: '0 6px 12px rgb(0 0 0 / 23%), 0 10px 40px rgb(0 0 0 / 19%)',
    borderRadius: '15px',
    minWidth: '200px',
  };
  const desktopStyle = {
    position: 'absolute',
    top: 15,
    right: 15,
    boxShadow:
      '0 6px 12px rgb(0 0 0 / 23%), 0 10px 40px rgb(255 255 255 / 19%)',
    borderRadius: '15px',
    minWidth: '300px',
    backgroundColor: 'rgb(255 255 255 / 85%)',
    padding: '15px 20px',
  };
  const signOut = useSignOutDeck();
  const navigate = useNavigate();

  return (
    <Box
      sx={isMobile ? mobileStyle : desktopStyle}
      elevation={24}
      square='false'
    >
      <Stack
        direction='row'
        spacing={2}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}
      >
        <Tooltip title='Manage Account Details'>
          <Avatar
            alt='User'
            src={user?.extras?.profile_pic || IMG_USER}
            {...stringAvatar(user?.username || 'User')}
            sx={{
              width: 80,
              height: 80,
              '&:hover': {
                filter: 'brightness(0.8)',
                cursor: 'pointer',
              },
            }}
            onClick={() => {
              navigate(URL_PROFILE);
            }}
          />
        </Tooltip>
        <Stack spacing={0}>
          <Box
            sx={{
              fontSize: '1rem',
              color: 'black',
            }}
          >
            {user ? user?.username : 'Loading...'}
          </Box>
          <Typography
            variant='caption'
            sx={{
              color: 'black',
              p: 0,
            }}
          >
            {user ? user?.extras?.role : 'Role'}
          </Typography>
          <LoadingButton
            variant='outlined'
            size='small'
            onClick={() => signOut()}
            sx={{ fontSize: '0.75rem', marginTop: '5px' }}
            color='error'
            startIcon={<LogoutIcon />}
          >
            Logout
          </LoadingButton>
        </Stack>
      </Stack>
    </Box>
  );
};
