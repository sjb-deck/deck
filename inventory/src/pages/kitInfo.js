import React from 'react';

import { NavBar, Footer, LoadingSpinner } from '../components';
import { KitInfoContent } from '../components';
import { useKit, useUser } from '../hooks/queries';

export const KitInfo = () => {
  const { data: userData } = useUser();
  const params = new URLSearchParams(window.location.search);
  const { data: kitData } = useKit({
    kitId: params.get('kitId'),
  });

  console.log('Kit INFO: ', userData, kitData);
  return (
    <>
      <NavBar user={userData} />
      <div style={{ minHeight: '100vh' }}>
        {kitData ? <KitInfoContent kitData={kitData} /> : <LoadingSpinner />}
      </div>
      <Footer />
    </>
  );
};
