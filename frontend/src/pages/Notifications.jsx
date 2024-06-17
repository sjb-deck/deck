import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

import { Footer, NavBar } from '../components';
import { NotificationList } from '../components';
import '../globals/styles/inventoryBase.scss';

export const Notifications = () => {
  const userData = useAuthUser();

  return (
    <>
      <NavBar user={userData} />
      <div style={{ padding: '1vh' }} />
      <NotificationList />
      <Footer />
    </>
  );
};
