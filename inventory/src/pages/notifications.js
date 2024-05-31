import React from 'react';

import { Footer, NavBar } from '../components';
import { NotificationList } from '../components/Notifications';
import '../globals/styles/inventoryBase.scss';
import { useUser } from '../hooks/queries';

export const Notifications = () => {
  const { data: userData } = useUser();

  return (
    <>
      <NavBar user={userData} />
      <div style={{ padding: '2vh' }} />
      <NotificationList />
      <Footer />
    </>
  );
};
