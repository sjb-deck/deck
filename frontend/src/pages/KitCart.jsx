import React from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

import { Footer, NavBar, KitCartContent } from '../components';

export const KitCart = () => {
  const user = useAuthUser();

  return (
    <>
      <NavBar user={user} />
      <KitCartContent />
      <Footer />
    </>
  );
};
