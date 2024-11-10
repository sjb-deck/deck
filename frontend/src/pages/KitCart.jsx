import { Footer, NavBar, KitCartContent } from '../components';
import { getUser } from '../hooks/auth/authHook';

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
