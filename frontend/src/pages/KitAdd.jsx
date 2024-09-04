import { getUser } from '../hooks/auth/authHook';

import { Footer, NavBar, KitCreate } from '../components';

import '../globals/styles/inventoryBase.scss';

export const KitAdd = () => {
  const userData = getUser();

  return (
    <>
      <NavBar user={userData} />
      <KitCreate />
      <div style={{ padding: '5vh' }} />
      <Footer />
    </>
  );
};
