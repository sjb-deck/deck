import { Box } from '@mui/material';
import { getUser } from '../hooks/auth/authHook';

import { Footer, NavBar, KitList } from '../components';

import '../globals/styles/inventoryBase.scss';

export const KitIndex = () => {
  const userData = getUser();

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
      <div style={{ padding: '5vh' }} />
      <Footer />
    </>
  );
};
