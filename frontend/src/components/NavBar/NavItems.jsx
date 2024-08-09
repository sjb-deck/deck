import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TextSnippet from '@mui/icons-material/TextSnippet';

import {
  URL_INV_ADD_ITEM,
  URL_INV_CART,
  URL_INV_VIEW_ITEM_LIST,
  URL_INV_VIEW_ORDERS_LOANS,
  URL_INV_LOAN_RETURN,
  URL_INV_VIEW_KITS,
  URL_INV_KITS_CART,
  URL_INV_KITS_ADD_BLUEPRINT,
  URL_INV_ITEMS,
  URL_INV_KITS_ADD_KIT,
} from '../../globals/urls';

import { StyledBadge } from './styled';

export const mobileCartNavItems = (itemCartCount, kitCartCount) => [
  {
    title: 'Items Cart',
    icon: (
      <StyledBadge badgeContent={itemCartCount} color='error'>
        <ShoppingCartIcon style={{ marginRight: 5 }} />
      </StyledBadge>
    ),
    link: URL_INV_CART,
  },
  {
    title: 'Kits Cart',
    icon: (
      <StyledBadge badgeContent={kitCartCount} color='error'>
        <ShoppingBasketIcon style={{ marginRight: 5 }} />
      </StyledBadge>
    ),
    link: URL_INV_KITS_CART,
  },
];
export const alertNavItems = (notiCount) => [
  {
    title: 'Alerts',
    icon: (
      <StyledBadge badgeContent={notiCount} color='error'>
        <NotificationsIcon style={{ marginRight: 5 }} />
      </StyledBadge>
    ),
    link: '#',
  },
];
export const itemsActionItems = [
  {
    title: 'Items',
    icon: <CategoryIcon style={{ marginRight: 5 }} />,
    link: URL_INV_ITEMS,
  },
  {
    title: 'Add new item',
    icon: <AddIcon style={{ marginRight: 5 }} />,
    link: URL_INV_ADD_ITEM,
  },
  {
    title: 'View item list',
    icon: <TextSnippet style={{ marginRight: 5 }} />,
    link: URL_INV_VIEW_ITEM_LIST,
  },
];
export const kitActionItems = [
  {
    title: 'Kits',
    icon: <MedicalServicesIcon style={{ marginRight: 5 }} />,
    link: URL_INV_VIEW_KITS,
  },
  {
    title: 'Create Kit',
    icon: <AddIcon style={{ marginRight: 5 }} />,
    link: URL_INV_KITS_ADD_KIT,
  },
  {
    title: 'Create Blueprint',
    icon: <AddIcon style={{ marginRight: 5 }} />,
    link: URL_INV_KITS_ADD_BLUEPRINT,
  },
];
export const actionItems = [
  {
    title: 'Loans',
    icon: <KeyboardReturnIcon style={{ marginRight: 5 }} />,
    link: URL_INV_LOAN_RETURN,
  },
  {
    title: 'Transactions',
    icon: <DashboardIcon style={{ marginRight: 5 }} />,
    link: URL_INV_VIEW_ORDERS_LOANS,
  },
];
