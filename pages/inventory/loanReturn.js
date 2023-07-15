import React, { useState } from 'react';

import NavBar from '../../components/NavBar/NavBar';
import Theme from '../../components/Themes';
import '../../inventory/src/scss/inventoryBase.scss';
import { INV_API_USER_URL, INV_API_LOANS_URL } from '../../globals';
import useFetch from '../../hooks/use-fetch';

import useMediaQuery from '@mui/material/useMediaQuery';

import FullAccordion from '../../components/LoanReturn/FullAccordion';

import Box from '@mui/material/Box';

const LoanReturn = () => {
  const { data: user, loading: userLoading } = useFetch(INV_API_USER_URL);
  const { data: loans, loading: loansLoading } = useFetch(INV_API_LOANS_URL);

  if (userLoading || loansLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Theme>
      <NavBar user={user} />
      <div
        className='nav-margin-compensate'
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
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
      </div>
    </Theme>
  );
};

export default LoanReturn;
