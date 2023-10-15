import { Box, Button, ButtonGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { Footer, LoanOrderList, NavBar, OrderList } from '../../components';
import { useUser } from '../../hooks/queries';
import '../../inventory/src/scss/inventoryBase.scss';

export const AdminIndex = () => {
  const { data: user, loading: userLoading, error: userError } = useUser();
  const [view, setView] = useState('orders');
  const [userData, setUserData] = useState(user);

  useEffect(() => {
    if (!userLoading && !userError) {
      setUserData(user);
    }
  }, [userLoading, userError, user]);

  return (
    <>
      <NavBar user={userData} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 10,
        }}
      >
        <ButtonGroup
          variant='text'
          aria-label='text button group'
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            width: { xs: '90%', sm: '70%', md: '70%', lg: '45%', xl: '35%' },
          }}
        >
          <Button
            color={view === 'orders' ? 'success' : 'primary'}
            variant={view === 'orders' ? 'contained' : 'outlined'}
            onClick={() => setView('orders')}
            sx={{ borderRadius: 0, marginBottom: 1 }}
          >
            Orders
          </Button>
          <Button
            color={view === 'loans' ? 'success' : 'primary'}
            variant={view === 'loans' ? 'contained' : 'outlined'}
            onClick={() => setView('loans')}
            sx={{ borderRadius: 0, marginBottom: 1 }}
          >
            Loans
          </Button>
        </ButtonGroup>
      </Box>
      <Box
        sx={{
          minHeight: 0.8,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {view === 'orders' ? <OrderList /> : <LoanOrderList />}
      </Box>
      <Footer />
    </>
  );
};
