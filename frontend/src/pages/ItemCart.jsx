import { getUser } from '../hooks/auth/authHook';

import { CartContent, Footer, NavBar } from '../components/';

export const ItemCart = () => {
  const user = getUser();

  return (
    <>
      <NavBar user={user} />
      <CartContent />
      <Footer />
    </>
  );
};
