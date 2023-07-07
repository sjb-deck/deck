import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { PropTypes } from 'prop-types';
import React from 'react';

import {
  URL_INV_CART,
  URL_INV_INDEX,
  URL_LOGOUT,
  URL_PROFILE,
  UserPropType,
} from '../../globals';
import { ColorModeContext } from '../Themes';
import { UserAvatar } from '../UserAvatar';

import { NavDrawer } from './NavDrawer';

/**
 * A React component that renders the NavBar
 * ie. the container at the very top of the page and is
 * fixed to top on scroll
 * @returns NavBar
 */

const drawerWidth = 240;
export const navItems = [
  {
    title: 'Alerts',
    icon: <NotificationsIcon key={1} style={{ marginRight: 5 }} />,
    link: '#',
  },
  {
    title: 'Cart',
    icon: <ShoppingCartIcon key={2} style={{ marginRight: 5 }} />,
    link: URL_INV_CART,
  },
];

const NavBar = ({ user }) => {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component='nav'>
        <Toolbar>
          <img
            height={35}
            style={{ marginRight: 10, cursor: 'pointer' }}
            src='/static/inventory/img/logo.png'
            alt='logo'
            onClick={() => (window.location.href = URL_INV_INDEX)}
          />
          <Typography
            style={{ cursor: 'pointer' }}
            variant='h6'
            component='div'
            sx={{ flexGrow: 1, display: { xs: 'block', sm: 'block' } }}
            onClick={() => (window.location.href = URL_INV_INDEX)}
          >
            IMS
          </Typography>

          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='end'
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'row',
              alignItems: 'center',
              spacing: 2,
            }}
          >
            {navItems.map((item, index) => (
              <Button
                color='inherit'
                aria-label={item.title}
                key={index}
                variant='text'
                onClick={() => (location.href = item.link)}
              >
                {item.icon}
                {item.title}
              </Button>
            ))}
            <IconButton onClick={colorMode.toggleColorMode} color='inherit'>
              {theme.palette.mode === 'dark' ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
            <IconButton onClick={handleClick} color='inherit'>
              <UserAvatar user={user} style={{ marginLeft: 10 }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => (window.location.href = URL_PROFILE)}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => (window.location.href = URL_LOGOUT)}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component='nav'>
        <Drawer
          anchor='right'
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          <NavDrawer user={user} onClick={handleClose} />
        </Drawer>
      </Box>
    </Box>
  );
};

export default NavBar;

NavBar.propTypes = {
  user: UserPropType,
  size: PropTypes.number,
};
