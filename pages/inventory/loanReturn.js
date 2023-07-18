import React, { useState } from 'react';

import NavBar from '../../components/NavBar/NavBar';
import Theme from '../../components/Themes';
import '../../inventory/src/scss/inventoryBase.scss';
import { INV_API_USER_URL, INV_API_LOANS_URL } from '../../globals';
import useFetch from '../../hooks/use-fetch';
import FullAccordion from '../../components/LoanReturn/FullAccordion';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";

const LoanReturn = () => {
    const { data: user, loading: userLoading } = useFetch(INV_API_USER_URL);
    const { data: loans, loading: loansLoading } = useFetch(INV_API_LOANS_URL);
    const isMobile = useMediaQuery('(max-width: 600px)');
    const isPC = useMediaQuery('(min-width: 1000px)');

  if (userLoading || loansLoading) {
    return <div>Loading...</div>;
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
        <Typography
            variant='h4'

        >
            Loan Return
        </Typography>
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
