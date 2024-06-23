import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useParams } from 'react-router-dom';

import {
  NavBar,
  Footer,
  LoadingSpinner,
  KitRestockContent,
  EmptyMessage,
} from '../components';
import { useKit } from '../hooks/queries';

export const KitRestock = () => {
  const userData = useAuthUser();
  const { kitId } = useParams();
  const { data: kitData } = useKit({ kitId: kitId });

  if (!kitId) {
    return (
      <>
        <NavBar user={userData} />
        <EmptyMessage message={'Please specify a kitId in query parameters'} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar user={userData} />
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {!kitData ? (
          <LoadingSpinner />
        ) : kitData.status != 'READY' || kitData.complete != 'incomplete' ? (
          <EmptyMessage message={'Kit cannot be restocked at this time'} />
        ) : (
          <KitRestockContent kit={kitData} />
        )}
      </div>
      <div style={{ padding: '5vh' }} />
      <Footer />
    </>
  );
};
