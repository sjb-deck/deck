import { getUser } from '../hooks/auth/authHook';
import { useParams } from 'react-router-dom';

import { NavBar, Footer, LoadingSpinner, KitInfoContent } from '../components';
import { useKit } from '../hooks/queries';

export const KitInfo = () => {
  const userData = getUser();
  const { kitId } = useParams();
  const { data: kitData } = useKit({
    kitId: kitId,
  });

  return (
    <>
      <NavBar user={userData} />
      <div style={{ minHeight: '100vh' }}>
        {kitData ? <KitInfoContent kitData={kitData} /> : <LoadingSpinner />}
      </div>
      <div style={{ padding: '5vh' }} />
      <Footer />
    </>
  );
};
