import { Accordion, AccordionSummary, Box, Grid } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { PropTypes } from 'prop-types';
import React from 'react';

import { INV_API_REVERT_ORDER, LoanOrderPropType } from '../../globals';
import usePostData from '../../hooks/use-post-data';

import LoanOrderContent from './LoanOrderContent';

const LoanOrderList = ({ loanOrders, refetch }) => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const { postData, isLoading } = usePostData(INV_API_REVERT_ORDER);

  const handleDeleteOrder = async (id) => {
    const payload = {
      id,
    };
    const resp = await postData(payload);
    if (resp.status === 'success') {
      await refetch();
    } else {
      // handle error notification here
    }
  };
  return (
    <Box
      sx={{
        width: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Accordion
        expanded={false}
        sx={{
          maxWidth: '750px',
          minWidth: isMobile ? '95%' : '70%',
          cursor: 'initial',
          paddingRight: '24px',
        }}
      >
        <AccordionSummary>
          <Grid container>
            <Grid item xs={2}>
              ID
            </Grid>
            <Grid item xs={isMobile ? 5 : 3}>
              Action
            </Grid>
            <Grid item xs={isMobile ? 5 : 4}>
              Date
            </Grid>
            {!isMobile && (
              <Grid item xs={3}>
                Return Date
              </Grid>
            )}
          </Grid>
        </AccordionSummary>
      </Accordion>
      {loanOrders.map((order) => {
        return (
          <LoanOrderContent
            key={order.pk}
            order={order}
            isMobile={isMobile}
            isLoading={isLoading}
            handleDeleteOrder={handleDeleteOrder}
          />
        );
      })}
    </Box>
  );
};

export default LoanOrderList;

LoanOrderList.propTypes = {
  loanOrders: PropTypes.arrayOf(LoanOrderPropType).isRequired,
  refetch: PropTypes.func.isRequired,
};
