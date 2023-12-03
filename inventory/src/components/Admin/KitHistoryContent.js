import { Close, DeleteForever, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';

import { getReadableDate } from '../../utils';

import { Modal } from './Modal';

export const KitHistoryContent = ({
  history,
  isMobile,
  isLoading,
  handleDeleteHistory,
}) => {
  const { formattedDateTime: historyDateTime } = getReadableDate(history?.date);
  const { formattedDate: dueDate } = getReadableDate(
    history?.loan_info?.due_date,
  );
  const { formattedDate: returnedDate } = getReadableDate(
    history?.loan_info?.return_date,
  );

  return (
    <Accordion
      data-testid={`history-${history.id}`}
      key={history.id}
      sx={{ width: isMobile ? '95%' : '70%' }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        id={`panel${history.id}-header`}
        aria-controls={`panel${history.id}-content`}
      >
        <Grid container>
          <Grid item xs={2}>
            {history.id}
          </Grid>
          <Grid item xs={3}>
            {history.type}
          </Grid>
          <Grid item xs={4}>
            {historyDateTime}
          </Grid>
          <Grid item xs={3}>
            {history.kit_name}
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails data-testid={`details-${history.id}`}>
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
                <span>Ordered by:</span>
                <span>{history.person.username}</span>
              </Box>
              {history.type === 'LOAN' && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>Loan Status:</span>
                  <span>
                    {history.loan_info.return_date ? 'Returned' : 'Active'}
                  </span>
                </Box>
              )}
              {history.type === 'LOAN' && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>Loanee Name:</span>
                  <span>{history.loan_info.loanee_name}</span>
                </Box>
              )}
              {history.type === 'LOAN' && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>Return Deadline:</span>
                  <span>{dueDate}</span>
                </Box>
              )}
              {returnedDate && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>Date Returned:</span>
                  <span>{returnedDate}</span>
                </Box>
              )}
              {history.order_id && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>Order ID:</span>
                  <span>
                    <a
                      href={`/inventory/items/receipt?orderId=${history.order_id}`}
                    >
                      {history.order_id}
                    </a>
                  </span>
                </Box>
              )}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Kit ID:</span>
                <span>{history.kit}</span>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} lg={0.5}>
            <Divider orientation='vertical' sx={{ borderRightWidth: 2 }} />
          </Grid>
          {history.snapshot && (
            <Grid item xs={12} lg={5.5}>
              <Stack spacing={1}>
                <Stack spacing={0}>
                  <Typography variant='button'>Snapshot:</Typography>
                  <Typography variant='caption' sx={{ opacity: 0.7 }}>
                    Items in kit after this event
                  </Typography>
                </Stack>
                {history.snapshot.map((item) => {
                  return (
                    <Box
                      key={item.item_expiry_id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>
                        <Typography variant='body'>
                          {item.item_expiry.item.name}
                          {'  '}
                        </Typography>
                        <Chip
                          size='small'
                          role='expiry-date'
                          aria-label={
                            item.item_expiry.expiry_date ?? 'No Expiry'
                          }
                          label={
                            item.item_expiry.expiry_date
                              ? getReadableDate(item.item_expiry.expiry_date)
                                  .formattedDate
                              : 'No Expiry'
                          }
                        />
                      </span>
                      <span>{item.quantity}</span>
                    </Box>
                  );
                })}
              </Stack>
            </Grid>
          )}
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
                role='button'
                color='error'
                endIcon={<DeleteForever />}
              >
                Revert History
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
                <span>Are you sure you want to revert this history?</span>
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
                      await handleDeleteHistory(history.id);
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
