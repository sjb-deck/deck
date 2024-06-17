import { Button, ButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import {
  Footer,
  NavBar,
  Theme,
  KitReturn,
  ItemLoanReturn,
} from '../components';

import '../globals/styles/inventoryBase.scss';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

export const LoanReturn = () => {
  const user = useAuthUser();
  const [view, setView] = useState('items');

  return (
    <Theme>
      <NavBar user={user} />
      <Stack
        className='nav-margin-compensate'
        alignItems='center'
        spacing={3}
        width='100%'
        minHeight={'100vh'}
      >
        <Typography variant='h4'>Loan Return</Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 10,
            width: '100%',
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
              color={view === 'items' ? 'success' : 'primary'}
              variant={view === 'items' ? 'contained' : 'outlined'}
              onClick={() => setView('items')}
              sx={{ borderRadius: 0, marginBottom: 1 }}
            >
              Items
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
          display='flex'
          flexDirection='column'
          alignItems='center'
          width='100%'
        >
          {view == 'items' ? <ItemLoanReturn /> : <KitReturn />}
        </Box>
      </Stack>
      <Footer />
    </Theme>
  );
};
