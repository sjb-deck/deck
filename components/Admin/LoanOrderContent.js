import { Close, DeleteForever, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Grid,
  Stack,
} from '@mui/material';
import { PropTypes } from 'prop-types';
import React from 'react';

import { LoanOrderPropType } from '../../globals';
import { getReadableDate } from '../../utils';
import { Modal } from '../Modal/Modal';

export const LoanOrderContent = ({
  order,
  isMobile,
  isLoading,
  handleDeleteOrder,
}) => {
  const { formattedDateTime: orderDateTime } = getReadableDate(order.date);
  const { formattedDate: returnDate } = getReadableDate(order.due_date);

  return (
    <Accordion key={order.id} sx={{ width: isMobile ? '95%' : '70%' }}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        id={`panel${order.id}-header`}
        aria-controls={`panel${order.id}-content`}
      >
        <Grid container>
          <Grid item xs={2}>
            {order.id}
          </Grid>
          <Grid item xs={isMobile ? 5 : 3}>
            {order.action}
          </Grid>
          <Grid item xs={isMobile ? 5 : 4}>
            {orderDateTime}
          </Grid>
          {!isMobile && (
            <Grid item xs={3}>
              {returnDate}
            </Grid>
          )}
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Divider variant='middle' sx={{ borderBottomWidth: 2 }} />
        <Grid container spacing={2} sx={{ marginTop: 0.5, marginBottom: 1 }}>
          <Grid item xs={12} lg={5.5}>
            <Stack spacing={1.5}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Loan Status:</span>
                <span>{order.loan_active ? 'Active' : 'Returned'}</span>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Loanee Name:</span>
                <span>{order.loanee_name}</span>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Other info:</span>
                <span>{order.other_info ?? '-'}</span>
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Return Date:</span>
                <span>{returnDate}</span>
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
                    <span>{item.ordered_quantity}</span>
                  </Box>
                );
              })}
            </Stack>
          </Grid>
        </Grid>
        <Divider variant='middle' sx={{ borderBottomWidth: 2 }} />
        <Box
          sx={{
            width: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 1,
          }}
        >
          <Modal
            control={
              <Button
                variant='contained'
                role='submit-button'
                color='error'
                endIcon={<DeleteForever />}
              >
                Revert Loan
              </Button>
            }
            maxWidth={500}
          >
            {(helper) => (
              <Stack
                sx={{ p: 2, paddingY: 4 }}
                spacing={2}
                justifyContent='center'
                alignItems='center'
              >
                <span>Are you sure you want to delete this order?</span>
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', width: 1 }}
                  gap={4}
                >
                  <Button
                    variant='contained'
                    role='submit-button'
                    color='error'
                    endIcon={<DeleteForever />}
                    disabled={isLoading}
                    onClick={async () => {
                      await handleDeleteOrder(order.id);
                      helper.close();
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant='contained'
                    endIcon={<Close />}
                    onClick={() => helper.close()}
                  >
                    Cancel
                  </Button>
                </Box>
              </Stack>
            )}
          </Modal>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

LoanOrderContent.propTypes = {
  order: LoanOrderPropType,
  isMobile: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleDeleteOrder: PropTypes.func.isRequired,
};
