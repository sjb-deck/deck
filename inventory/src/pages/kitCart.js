import React from 'react';

import { Footer, LoadingSpinner, NavBar } from '../components';
import { KitCartContent } from '../components/KitCart/KitCartContent';
import { useUser } from '../hooks/queries';

export const KitCart = () => {
  const { data: user, isLoading: userLoading } = useUser();

  return !userLoading ? (
    <>
      <NavBar user={user} />
      <KitCartContent />
      <Footer />
    </>
  ) : (
    <LoadingSpinner />
  );
};
