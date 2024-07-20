import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Divider } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  URL_INV_CART,
  URL_PROFILE,
  URL_INV_KITS_CART,
} from '../../globals/urls';
import { useSignOutDeck } from '../../hooks/auth';
import { CartContext, KitCartContext } from '../../providers';
import { ColorModeContext } from '../Theme';

import { NavDrawer } from './NavDrawer';
import { NavIcon } from './NavIcon';
import { actionItems, itemsActionItems, kitActionItems } from './NavItems';
import { StyledBadge } from './styled';
import { UserAvatar } from './UserAvatar';

/**
 * A React component that renders the NavBar
 * ie. the container at the very top of the page and is
 * fixed to top on scroll
 * @returns NavBar
 */

const drawerWidth = 240;

export const NavBar = ({ user }) => {
  const theme = useTheme();
  const currentUrl = window.location.pathname.split('/').filter((x) => x);
  const isItemsPage = currentUrl[1] == 'items';
  const isKitsPage = currentUrl[1] == 'kits';
  const { cartItems } = useContext(CartContext);
  const { kitCartItems } = useContext(KitCartContext);
  const colorMode = useContext(ColorModeContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);
  const [cartMenu, setCartMenu] = useState(null);
  const navigate = useNavigate();
  const signOut = useSignOutDeck();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCartSelection = (e) => {
    setCartMenu(e.currentTarget);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component='nav'>
        <Toolbar>
          <NavIcon />

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
            <Button
              color='inherit'
              aria-label='Alerts'
              variant='text'
              onClick={() => console.log('alert')}
            >
              <StyledBadge badgeContent={0} color='error'>
                <NotificationsIcon style={{ marginRight: 5 }} />
              </StyledBadge>
              Alerts
            </Button>
            <Button
              color='inherit'
              aria-label='Cart'
              variant='text'
              onClick={(e) =>
                isItemsPage
                  ? navigate(URL_INV_CART)
                  : isKitsPage
                    ? navigate(URL_INV_KITS_CART)
                    : handleCartSelection(e)
              }
            >
              <>
                {isItemsPage ? (
                  <StyledBadge badgeContent={cartItems.length} color='error'>
                    <ShoppingCartIcon style={{ marginRight: 5 }} />
                  </StyledBadge>
                ) : isKitsPage ? (
                  <StyledBadge badgeContent={kitCartItems.length} color='error'>
                    <ShoppingBasketIcon style={{ marginRight: 5 }} />
                  </StyledBadge>
                ) : (
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: '5px',
                      position: 'relative',
                    }}
                  >
                    <ShoppingCartIcon
                      style={{
                        position: 'absolute',
                        transform: 'translate(-5px, -5px)',
                        fontSize: 20,
                      }}
                    />
                    <ShoppingBasketIcon
                      style={{
                        position: 'absolute',
                        transform: 'translate(5px, 5px)',
                        fontSize: 20,
                      }}
                    />
                    <div style={{ paddingRight: '25px' }} />
                  </span>
                )}
              </>
              Cart
            </Button>
            <Menu
              anchorEl={cartMenu}
              open={Boolean(cartMenu)}
              onClose={() => setCartMenu(null)}
            >
              <MenuItem
                sx={{ paddingY: 1, paddingX: 1 }}
                onClick={() => navigate(URL_INV_CART)}
              >
                <StyledBadge badgeContent={cartItems.length} color='error'>
                  <ShoppingCartIcon style={{ marginRight: 5 }} />
                </StyledBadge>
                Items Cart
              </MenuItem>
              <MenuItem
                sx={{ paddingY: 1, paddingX: 1 }}
                onClick={() => navigate(URL_INV_KITS_CART)}
              >
                <StyledBadge badgeContent={kitCartItems.length} color='error'>
                  <ShoppingBasketIcon style={{ marginRight: 5 }} />
                </StyledBadge>
                Kits Cart
              </MenuItem>
            </Menu>
            <IconButton
              onClick={(e) => setActionMenu(e.currentTarget)}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <IconButton onClick={colorMode.toggleColorMode} color='inherit'>
              {theme.palette.mode === 'dark' ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
            <IconButton onClick={handleClick} color='inherit'>
              <UserAvatar user={user} size={40} style={{ marginLeft: 10 }} />
            </IconButton>
            <Menu
              anchorEl={actionMenu}
              open={Boolean(actionMenu)}
              onClose={() => setActionMenu(null)}
            >
              {itemsActionItems.map((item) => {
                return (
                  <MenuItem
                    key={item.link}
                    sx={{ paddingY: 1, paddingX: 1 }}
                    onClick={() => navigate(item.link)}
                  >
                    {item.icon}
                    {item.title}
                  </MenuItem>
                );
              })}
              <Divider />
              {kitActionItems.map((item) => {
                return (
                  <MenuItem
                    key={item.link}
                    sx={{ paddingY: 1, paddingX: 1 }}
                    onClick={() => navigate(item.link)}
                  >
                    {item.icon}
                    {item.title}
                  </MenuItem>
                );
              })}
              <Divider />
              {actionItems.map((item) => {
                return (
                  <MenuItem
                    key={item.link}
                    sx={{ paddingY: 1, paddingX: 1 }}
                    onClick={() => navigate(item.link)}
                  >
                    {item.icon}
                    {item.title}
                  </MenuItem>
                );
              })}
            </Menu>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => navigate(URL_PROFILE)}>Profile</MenuItem>
              <MenuItem onClick={() => signOut()}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box>
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
