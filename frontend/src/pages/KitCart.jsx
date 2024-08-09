import { getUser } from '../hooks/auth/authHook';

import { Footer, NavBar, KitCartContent } from '../components';

export const KitCart = () => {
  const user = getUser();

  return (
    <>
      <NavBar user={user} />
      <KitCartContent />
      <Footer />
    </>
  );
};
