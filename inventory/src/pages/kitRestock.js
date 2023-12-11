import { Stack } from '@mui/material';
import React from 'react';

import { NavBar, Footer, KitSimpleInfo, LoadingSpinner } from '../components';
import { useKit, useKitRestockOptions, useUser } from '../hooks/queries';

import '../globals/styles/inventoryBase.scss';

export const KitRestock = () => {
  const { data: userData } = useUser();
  const params = new URLSearchParams(window.location.search);
  const kitId = params.get('kitId');
  const { data: kitData, isLoading: kitLoading } = useKit({ kitId: kitId });
  const { data: kitRestockOptions, isLoading: kitRestockOptionsLoading } =
    useKitRestockOptions(kitId);

  return (
    <>
      <NavBar user={userData} />
      <Stack
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
        className='nav-margin-compensate'
      >
        {kitLoading || kitRestockOptionsLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <KitSimpleInfo kitData={kitData} />
            {kitRestockOptions.map((item) => {
              return <p key={item.item_id}>test</p>;
            })}
          </>
        )}
      </Stack>
      <Footer />
    </>
  );
};
