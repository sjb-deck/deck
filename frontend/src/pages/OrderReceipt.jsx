import { useParams } from 'react-router-dom';

import { Receipt, NavBar, Footer } from '../components';
import { getUser } from '../hooks/auth/authHook';

export const OrderReceipt = () => {
  const userData = getUser();
  const { orderId } = useParams();

  return (
    <>
      <NavBar user={userData} />
      <Receipt orderId={orderId} />
      <Footer />
    </>
  );
};
