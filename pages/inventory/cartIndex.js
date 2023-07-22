import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react';

import CartContent from '../../components/CartContent/CartContent';
import { CartProvider } from '../../components/CartContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import NavBar from '../../components/NavBar/NavBar';
import Theme from '../../components/Themes';
import { INV_API_USER_URL } from '../../globals';
import useFetch from '../../hooks/use-fetch';

import '../../inventory/src/scss/inventoryBase.scss';

const CartIndex = () => {
  const { data: user, loading: userLoading } = useFetch(INV_API_USER_URL);

  return !userLoading ? (
    <Theme>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CartProvider>
          <NavBar user={user} />
          <CartContent />
        </CartProvider>
      </LocalizationProvider>
    </Theme>
  ) : (
    <LoadingSpinner />
  );
};

export default CartIndex;
