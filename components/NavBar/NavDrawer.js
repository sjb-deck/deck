import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import { Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React from 'react';

import { URL_LOGOUT, URL_PROFILE, UserPropType } from '../../globals';
import { ColorModeContext } from '../Themes';
import { UserAvatar } from '../UserAvatar';

import { navItems } from './NavBar';

/**
 * A React component that renders the NavDrawer
 * ie. the container on the right for mobile when
 * hamburger icon on NavBar is clicked
 * @returns NavDrawer
 */

export const NavDrawer = ({ user }) => {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          my: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        {user ? (
          <UserAvatar user={user} size={100} />
        ) : (
          <Skeleton variant='circular'>
            <UserAvatar size={100} />
          </Skeleton>
        )}

        <Typography variant='h6' sx={{ mt: 2 }}>
          {user ? `Hello ${user.name}` : <Skeleton />}
        </Typography>

        <Typography variant='caption'>
          {user ? user.role : <Skeleton />}
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <Button
            fullWidth
            sx={{ justifyContent: 'center', textTransform: 'none' }}
            startIcon={<AccountCircleIcon />}
            onClick={() => (window.location.href = URL_PROFILE)}
          >
            Profile
          </Button>
        </ListItem>
        <ListItem disablePadding>
          <Button
            fullWidth
            sx={{ justifyContent: 'center', textTransform: 'none' }}
            startIcon={
              theme.palette.mode === 'dark' ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )
            }
            onClick={colorMode.toggleColorMode}
          >
            Toggle Mode
          </Button>
        </ListItem>
      </List>
      <Divider />
      <List>
        {navItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <Button
              fullWidth
              sx={{ justifyContent: 'center', textTransform: 'none' }}
              startIcon={item.icon}
              onClick={() => (location.href = item.link)}
            >
              {item.title}
            </Button>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <Button
            fullWidth
            sx={{ justifyContent: 'center', textTransform: 'none' }}
            startIcon={<LogoutIcon />}
            onClick={() => (window.location.href = URL_LOGOUT)}
          >
            Logout
          </Button>
        </ListItem>
      </List>
    </Box>
  );
};

NavDrawer.propTypes = {
  user: UserPropType,
};
