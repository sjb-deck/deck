import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

import { Footer, NavBar, KitCreate } from '../components';

import '../globals/styles/inventoryBase.scss';

export const KitAdd = () => {
  const userData = useAuthUser();

  return (
    <>
      <NavBar user={userData} />
      <KitCreate />
      <div style={{ padding: '5vh' }} />
      <Footer />
    </>
  );
};
