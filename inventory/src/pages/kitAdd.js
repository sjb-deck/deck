import React from 'react';

import { Footer, NavBar } from '../components';
import { KitCreate } from '../components/KitAdd/KitCreate';
import '../globals/styles/inventoryBase.scss';
import { useUser } from '../hooks/queries';

export const KitAdd = () => {
  const { data: userData } = useUser();

  return (
    <>
      <NavBar user={userData} />
      <KitCreate />
      <div style={{ padding: '5vh' }} />
      <Footer />
    </>
  );
};
