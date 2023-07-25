import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  Stack,
} from '@mui/material';
import { PropTypes } from 'prop-types';
import React from 'react';

import { OrderPropType } from '../../globals';

export const OrderContent = ({ order, isMobile }) => {
  const date = new Date(order.date);
  const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  return (
    <Accordion sx={{ maxWidth: '750px', minWidth: isMobile ? '95%' : '70%' }}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        id={`panel${order.pk}-header`}
        aria-controls={`panel${order.pk}-content`}
      >
        <Grid container>
          <Grid item xs={2}>
            {order.pk}
          </Grid>
          <Grid item xs={isMobile ? 5 : 3}>
            {order.action}
          </Grid>
          <Grid item xs={isMobile ? 5 : 4}>
            {date.toLocaleDateString()} {formattedTime}
          </Grid>
          {!isMobile && (
            <Grid item xs={3}>
              {order.reason}
            </Grid>
          )}
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Divider variant='middle' sx={{ borderBottomWidth: 2 }} />
        <Grid container spacing={2} sx={{ marginTop: 0.5 }}>
          <Grid item xs={12} lg={5.5}>
            <Stack spacing={1.5}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Other info:</span>
                <span>{order.other_info ?? 'none'}</span>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Reason:</span>
                <span>{order.reason}</span>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>No. of items</span>
                <span>{order.order_items.length}</span>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} lg={0.5}>
            <Divider orientation='vertical' sx={{ borderRightWidth: 2 }} />
          </Grid>
          <Grid item xs={12} lg={5.5}>
            <Stack spacing={1}>
              {order.order_items.map((item) => {
                return (
                  <Box
                    key={item.item_expiry.item.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{item.item_expiry.item.name}</span>
                    <span>placeholder qty</span>
                  </Box>
                );
              })}
            </Stack>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

OrderContent.propTypes = {
  order: OrderPropType,
  isMobile: PropTypes.bool.isRequired,
};
