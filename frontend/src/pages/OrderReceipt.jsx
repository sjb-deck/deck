import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useParams } from 'react-router-dom';

import { Receipt, NavBar, Footer } from '../components';

export const OrderReceipt = () => {
  const userData = useAuthUser();
  const { orderId } = useParams();

  return (
    <>
      <NavBar user={userData} />
      <Receipt orderId={orderId} />
      <Footer />
    </>
  );
};
