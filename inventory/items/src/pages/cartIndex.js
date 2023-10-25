import React from 'react';

import { CartContent, Footer, LoadingSpinner, NavBar } from '../components';
import { useUser } from '../../../src/hooks/queries';

export const CartIndex = () => {
  const { data: user, isLoading: userLoading } = useUser();

  return !userLoading ? (
    <>
      <NavBar user={user} />
      <CartContent />
      <Footer />
    </>
  ) : (
    <LoadingSpinner />
  );
};
