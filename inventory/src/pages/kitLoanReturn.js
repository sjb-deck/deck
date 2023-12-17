import React from 'react';

import { NavBar, Footer, LoadingSpinner } from '../components';
import { useKit } from '../hooks/queries';

export const KitLoanReturn = () => {
  const params = new URLSearchParams(window.location.search);
  const { data: kitData } = useKit({
    kitId: params.get('kitId'),
  });

  console.log(kitData);
  return (
    <>
      <NavBar />
      <div>hello</div>
      <Footer />
    </>
  );
};
