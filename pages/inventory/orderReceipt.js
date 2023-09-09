import React from 'react';

import { NavBar, Theme } from '../../components';
import Receipt from '../../components/Admin/Receipt';

const OrderReceipt = () => {
  const params = new URLSearchParams(window.location.search);

  const orderDetails = JSON.parse(decodeURIComponent(params.get('orderData')));
  const user = orderDetails.user;

  return (
    <Theme>
      <NavBar user={user}></NavBar>
      <Receipt orderData={orderDetails}></Receipt>
    </Theme>
  );
};

export default OrderReceipt;
