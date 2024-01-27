import { Box } from '@mui/material';
import React from 'react';

import { Footer, NavBar } from '../components';
import { KitList } from '../components/KitIndex/KitList';
import '../globals/styles/inventoryBase.scss';
import { useUser } from '../hooks/queries';

export const KitIndex = () => {
  const { data: userData } = useUser();

  return (
    <>
      <NavBar user={userData} />

      <Box
        sx={{
          minHeight: 0.8,
          display: 'flex',
          width: 1,
          marginTop: 10,
        }}
      >
        <KitList />
      </Box>

      <Footer />
    </>
  );
};
