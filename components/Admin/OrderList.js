import { Accordion, AccordionSummary, Box, Grid } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { PropTypes } from 'prop-types';
import React from 'react';

import { OrderPropType } from '../../globals';

import OrderContent from './OrderContent';

const OrderList = ({ orders }) => {
  const isMobile = useMediaQuery('(max-width: 800px)');
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
                Reason
              </Grid>
            )}
          </Grid>
        </AccordionSummary>
      </Accordion>
      {orders.map((order) => {
        return (
          <OrderContent key={order.pk} order={order} isMobile={isMobile} />
        );
      })}
    </Box>
  );
};

export default OrderList;

OrderList.propTypes = {
  orders: PropTypes.arrayOf(OrderPropType).isRequired,
};
