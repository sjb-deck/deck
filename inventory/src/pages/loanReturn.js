import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';

import {
  Footer,
  FullAccordion,
  LoadingSpinner,
  NavBar,
  Theme,
} from '../components';
import { useUser, useLoans } from '../hooks/queries';
import '../globals/styles/inventoryBase.scss';

export const LoanReturn = () => {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: loans, isLoading: loansLoading } = useLoans();

  if (userLoading || loansLoading) {
    return <LoadingSpinner />;
  }

  if (!loans || loans.length === 0) {
    return (
      <Theme>
        <NavBar user={user} />
        <Stack justifyContent='center' alignItems='center'>
          <div className='nav-margin-compensate'>
            <Typography variant='h1'>No active loans</Typography>
          </div>
        </Stack>
      </Theme>
    );
  }

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
          display='flex'
          flexDirection='column'
          alignItems='center'
          width='100%'
        >
          {loans.map((loan, index) => (
            <FullAccordion
              key={index}
              index={(index + 1).toString() + '.'}
              loan={loan}
            />
          ))}
        </Box>
      </Stack>
      <Footer />
    </Theme>
  );
};