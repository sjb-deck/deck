import React from 'react';

import { NavBar, Footer, LoadingSpinner } from '../components';
import { KitInfoContent } from '../components';
import { useKit, useUser } from '../hooks/queries';

export const KitInfo = () => {
  const { data: userData } = useUser();
  const params = new URLSearchParams(window.location.search);
  const { data: kitData, isLoading: kitLoading } = useKit({
    kitId: params.get('kitId'),
  });

  return (
    <>
      <NavBar user={userData} />
      {kitLoading ? <LoadingSpinner /> : <KitInfoContent kitData={kitData} />}
      <Footer />
    </>
  );
};
