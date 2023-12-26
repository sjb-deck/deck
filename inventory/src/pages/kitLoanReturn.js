import React from 'react';

import { NavBar, Footer, LoadingSpinner } from '../components';
import { KitInfoSection, KitItemReturnSection } from '../components';

import { useUser, useKit } from '../hooks/queries';
import { Box, Stack, Fab, Typography, Divider } from '@mui/material';

export const KitLoanReturn = () => {
  const { data: userData } = useUser();
  const params = new URLSearchParams(window.location.search);
  const { data: kitData } = useKit({
    kitId: params.get('kitId'),
  });

  console.log(userData, kitData);
  return (
    <>
      <NavBar user={userData} />
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        {/* Account for nav bar height */}
        <Box sx={{ height: '64px' }} />
        {kitData ? (
          <KitLoanReturnContent kitData={kitData} />
        ) : (
          <LoadingSpinner />
        )}
      </Box>
      <Footer />
    </>
  );
};

const KitLoanReturnContent = ({ kitData }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
      }}
    >
      <KitInfoSection kitData={kitData} />
      <Divider
        orientation='vertical'
        variant='middle'
        flexItem
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[400]
              : theme.palette,
        }}
      />
      <KitItemReturnSection />
      <Fab
        variant='extended'
        color='primary'
        size='large'
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        Submit
      </Fab>
    </Box>
  );
};
