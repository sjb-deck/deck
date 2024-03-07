import { Pagination, Skeleton } from '@mui/material';
import React, { useState } from 'react';

import { useActiveLoans } from '../../../hooks/queries';
import { EmptyMessage } from '../../EmptyMessage';
import { LoadingSpinner } from '../../LoadingSpinner';

import { FullAccordion } from './FullAccordion';

export const ItemLoanReturn = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: loans,
    isLoading: loansLoading,
    isError: loansError,
  } = useActiveLoans(currentPage);
  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  if (loansLoading) {
    return <LoadingSpinner />;
  }

  if (!loansLoading && !loans && !loansError) {
    return <EmptyMessage message='There are currently no active loans' />;
  }

  return (
    <>
      {loans ? (
        <>
          {loans.results.map((loan, index) => (
            <FullAccordion
              key={index}
              index={(index + 1).toString() + '.'}
              loan={loan}
            />
          ))}
          <Pagination
            page={currentPage}
            count={loans.num_pages}
            onChange={handlePageChange}
            sx={{ paddingTop: 2 }}
          />
        </>
      ) : (
        <Skeleton>
          <Pagination />
        </Skeleton>
      )}
    </>
  );
};
