import { Footer, NavBar, NotificationList } from '../components';
import '../globals/styles/inventoryBase.scss';
import { getUser } from '../hooks/auth/authHook';

export const Notifications = () => {
  const userData = getUser();

  return (
    <>
      <NavBar user={userData} />
      <div style={{ padding: '1vh' }} />
      <NotificationList />
      <Footer />
    </>
  );
};
