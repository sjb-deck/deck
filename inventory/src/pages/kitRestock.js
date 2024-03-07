import React from 'react';

import {
  NavBar,
  Footer,
  LoadingSpinner,
  KitRestockContent,
  EmptyMessage,
} from '../components';
import { useKit, useUser } from '../hooks/queries';

export const KitRestock = () => {
  const { data: userData } = useUser();
  const params = new URLSearchParams(window.location.search);
  const kitId = params.get('kitId');
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
