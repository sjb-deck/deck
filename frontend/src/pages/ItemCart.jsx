import React from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

import { CartContent, Footer, NavBar } from '../components/';

export const ItemCart = () => {
  const user = useAuthUser();

  return (
    <>
      <NavBar user={user} />
      <CartContent />
      <Footer />
    </>
  );
};
