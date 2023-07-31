import React from 'react';

import { CartContent, LoadingSpinner, NavBar } from '../../components';
import { useUser } from '../../hooks/queries';
import '../../inventory/src/scss/inventoryBase.scss';
import { CartProvider } from '../../providers';

export const CartIndex = () => {
  const { data: user, isLoading: userLoading } = useUser();

  return !userLoading ? (
    <CartProvider>
      <NavBar user={user} />
      <CartContent />
    </CartProvider>
  ) : (
    <LoadingSpinner />
  );
};
