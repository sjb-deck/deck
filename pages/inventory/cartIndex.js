import React from 'react';

import { CartContent, LoadingSpinner, NavBar } from '../../components';
import { useUser } from '../../hooks/queries';
import '../../inventory/src/scss/inventoryBase.scss';

export const CartIndex = () => {
  const { data: user, isLoading: userLoading } = useUser();

  return !userLoading ? (
    <>
      <NavBar user={user} />
      <CartContent />
    </>
  ) : (
    <LoadingSpinner />
  );
};
