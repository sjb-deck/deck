import React, { useEffect, useState } from 'react';

import { CartProvider } from '../../components/CartContext';
import Footer from '../../components/Footer';
import NavBar from '../../components/NavBar/NavBar';
import { SnackBarAlerts } from '../../components/SnackBarAlerts';
import Theme from '../../components/Themes';
import { INV_API_ORDERS_URL, INV_API_USER_URL } from '../../globals';
import useFetch from '../../hooks/use-fetch';
import '../../inventory/src/scss/inventoryBase.scss';

const AdminIndex = () => {
  const {
    data: orders,
    loading: dataLoading,
    error: dataError,
  } = useFetch(INV_API_ORDERS_URL);
  const {
    data: user,
    loading: userLoading,
    error: userError,
  } = useFetch(INV_API_USER_URL);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [userData, setUserData] = useState(user);

  useEffect(() => {
    if (dataError || userError) {
      setSnackbarOpen(true);
    }
    if (!userLoading && !userError) {
      setUserData(user);
    }
  }, [dataLoading, userLoading, dataError, userError, user]);

  return (
    <Theme>
      <CartProvider>
        <NavBar user={userData} />
        <SnackBarAlerts
          open={snackbarOpen}
          message={dataError?.message || userError?.message}
        />

        <Footer />
      </CartProvider>
    </Theme>
  );
};

export default AdminIndex;
