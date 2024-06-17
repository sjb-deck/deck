import { Box, Button, ButtonGroup } from '@mui/material';
import { useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

import {
  Footer,
  KitHistoryList,
  LoanOrderList,
  NavBar,
  OrderList,
} from '../components';
import '../globals/styles/inventoryBase.scss';

export const AdminIndex = () => {
  const userData = useAuthUser();
  const [view, setView] = useState('orders');

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
          className='dynamic-width'
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
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
          <Button
            color={view === 'kits' ? 'success' : 'primary'}
            variant={view === 'kits' ? 'contained' : 'outlined'}
            onClick={() => setView('kits')}
            sx={{ borderRadius: 0, marginBottom: 1 }}
          >
            Kits
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
        {view === 'orders' ? (
          <OrderList />
        ) : view === 'loans' ? (
          <LoanOrderList />
        ) : (
          <KitHistoryList />
        )}
      </Box>
      <div style={{ padding: '5vh' }} />
      <Footer />
    </>
  );
};
