import { CartContent, Footer, NavBar } from '../components/';
import { getUser } from '../hooks/auth/authHook';

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
