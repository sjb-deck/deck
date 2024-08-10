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
import { useContext } from 'react';

import { URL_LOGOUT, URL_PROFILE } from '../../globals/urls';
import { CartContext, KitCartContext } from '../../providers';
import { ColorModeContext } from '../Theme';

import {
  actionItems,
  alertNavItems,
  itemsActionItems,
  kitActionItems,
  mobileCartNavItems,
} from './NavBar';
import { UserAvatar } from './UserAvatar';

/**
 * A React component that renders the NavDrawer
 * ie. the container on the right for mobile when
 * hamburger icon on NavBar is clicked
 * @returns NavDrawer
 */

export const NavDrawer = ({ user, numberOfNotifications }) => {
  const theme = useTheme();
  const { cartItems } = useContext(CartContext);
  const { kitCartItems } = useContext(KitCartContext);
  const colorMode = useContext(ColorModeContext);

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
          {user ? `Hello ${user.extras.name}` : <Skeleton />}
        </Typography>

        <Typography variant='caption'>
          {user ? user.extras.role : <Skeleton />}
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
        {mobileCartNavItems(cartItems.length, kitCartItems.length).map(
          (item, index) => (
            <ListItem key={index} disablePadding>
              <Button
                fullWidth
                sx={{ justifyContent: 'center', textTransform: 'none' }}
                startIcon={item.icon}
                onClick={() => (window.location.href = item.link)}
              >
                {item.title}
              </Button>
            </ListItem>
          ),
        )}
      </List>
      <Divider />
      <List>
        {alertNavItems(numberOfNotifications).map((item, index) => (
          <ListItem key={index} disablePadding>
            <Button
              fullWidth
              sx={{ justifyContent: 'center', textTransform: 'none' }}
              startIcon={item.icon}
              onClick={() => (window.location.href = item.link)}
            >
              {item.title}
            </Button>
          </ListItem>
        ))}
        {actionItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <Button
              fullWidth
              sx={{ justifyContent: 'center', textTransform: 'none' }}
              startIcon={item.icon}
              onClick={() => (window.location.href = item.link)}
            >
              {item.title}
            </Button>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {itemsActionItems.map((item) => {
          return (
            <ListItem key={item.link} disablePadding>
              <Button
                fullWidth
                sx={{ justifyContent: 'center', textTransform: 'none' }}
                startIcon={item.icon}
                onClick={() => (location.href = item.link)}
              >
                {item.title}
              </Button>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List>
        {kitActionItems.map((item) => {
          return (
            <ListItem key={item.link} disablePadding>
              <Button
                fullWidth
                sx={{ justifyContent: 'center', textTransform: 'none' }}
                startIcon={item.icon}
                onClick={() => (location.href = item.link)}
              >
                {item.title}
              </Button>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <Button
            fullWidth
            sx={{ justifyContent: 'center', textTransform: 'none' }}
            startIcon={<LogoutIcon />}
            onClick={() => (window.location.href = URL_LOGOUT)}
            color='error'
          >
            Logout
          </Button>
        </ListItem>
      </List>
    </Box>
  );
};
