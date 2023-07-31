import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';

import { FullAccordion, NavBar, Theme } from '../../components';
import { INV_API_LOANS_URL } from '../../globals';
import { useUser } from '../../hooks/queries';
import useFetch from '../../hooks/use-fetch';
import '../../inventory/src/scss/inventoryBase.scss';

const LoanReturn = () => {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: loans, loading: loansLoading } = useFetch(INV_API_LOANS_URL);

  if (userLoading || loansLoading) {
    return <div>LOADING...</div>;
  }

  if (loans.length === 0) {
    return (
      <Theme>
        <NavBar user={user} />
        <Stack justifyContent='center' alignItems='center'>
          <Typography className='nav-margin-compensate' variant='h1'>
            No active loans
          </Typography>
        </Stack>
      </Theme>
    );
  }

  return (
    <Theme>
      <NavBar user={user} />
      <Stack
        alignItems='center'
        justifyContent='center'
        spacing={3}
        width='100%'
        position='absolute'
        top='80px'
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
    </Theme>
  );
};

export default LoanReturn;
