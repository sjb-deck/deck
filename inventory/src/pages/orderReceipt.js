import React from 'react';

import { Receipt, NavBar, Footer } from '../components';
import { useUser } from '../hooks/queries';

export const OrderReceipt = () => {
  const { data: userData } = useUser();
  const params = new URLSearchParams(window.location.search);
  const orderId = JSON.parse(decodeURIComponent(params.get('orderId')));

  return (
    <>
      <NavBar user={userData} />
      <Receipt orderId={orderId} />
      <Footer />
    </>
  );
};
