import { Pagination, Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';

import {
  Footer,
  FullAccordion,
  LoadingSpinner,
  NavBar,
  Theme,
} from '../components';
import { useUser, useActiveLoans } from '../hooks/queries';

import '../globals/styles/inventoryBase.scss';

export const LoanReturn = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: user, isLoading: userLoading } = useUser();
  const { data: loans, isLoading: loansLoading } = useActiveLoans(currentPage);

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  if (userLoading || loansLoading) {
    return <LoadingSpinner />;
  }

  if (!loans || loans.results.length === 0) {
    return (
      <Theme>
        <NavBar user={user} />
        <Stack justifyContent='center' alignItems='center' minHeight={'100vh'}>
          <div
            className='nav-margin-compensate'
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              alignItems: 'center',
              width: '75%',
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              className='bi bi-cart-dash-fill'
              viewBox='0 0 16 16'
              style={{ width: '15vw', height: '15vw', marginBottom: '5vw' }}
            >
              <path d='M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM6.5 7h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1 0-1z' />
            </svg>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '5vw',
              }}
            >
              <Typography variant='h3' gutterBottom>
                No active loans
              </Typography>
              <Typography variant='body'>
                Make a loan order and you will see it here!
              </Typography>
            </div>
          </div>
        </Stack>
        <Footer />
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
          {loans.results.map((loan, index) => (
            <FullAccordion
              key={index}
              index={(index + 1).toString() + '.'}
              loan={loan}
            />
          ))}
        </Box>
        {loans ? (
          <Pagination
            page={currentPage}
            count={loans.num_pages}
            onChange={handlePageChange}
          />
        ) : (
          <Skeleton>
            <Pagination />
          </Skeleton>
        )}
      </Stack>
      <Footer />
    </Theme>
  );
};
