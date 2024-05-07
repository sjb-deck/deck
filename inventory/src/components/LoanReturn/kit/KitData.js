import { ExpandMore } from '@mui/icons-material';
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
import { getReadableDate } from '../../../utils';

import React from 'react';

// TODO: This is the exact same as KitData from the KitIndex folder but since the kit object here is the KitHistory object instead of the Kit object, some fields are different. Change in the future to reuse the same component.

export const KitData = ({ kit, isMobile }) => {
  return (
    <Accordion
      data-testid={`kit-${kit.id}`}
      key={kit.id}
      sx={{
        width: isMobile ? '95%' : '70%',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        id={`panel${kit.id}-header`}
        aria-controls={`panel${kit.id}-content`}
      >
        <Grid container>
          <Grid item xs={2}>
            {kit.id}
          </Grid>
          <Grid item xs={isMobile ? 5 : 3}>
            {kit.kit_name}
          </Grid>
          <Grid item xs={isMobile ? 5 : 4}>
            {kit.loan_info.loanee_name}
          </Grid>
          {!isMobile && (
            <Grid item xs={3}>
              {getReadableDate(kit.loan_info.due_date).formattedDate}
            </Grid>
          )}
        </Grid>
      </AccordionSummary>
      <AccordionDetails data-testid={`details-${kit.id}`}>
        <Divider variant='middle' sx={{ borderBottomWidth: 2 }} />
        <Stack spacing={1} sx={{ marginTop: 2, marginBottom: 1 }}>
          {kit.snapshot.map((item) => {
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
                <span>{item.quantity}</span>
              </Box>
            );
          })}
        </Stack>
        <Box
          sx={{
            width: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 2,
            gap: 2,
          }}
        >
          <Button
            color='info'
            variant='contained'
            onClick={() =>
              window.location.replace(
                `/inventory/kits/kit_info?kitId=${kit.kit}`,
              )
            }
          >
            View Kit
          </Button>
          {kit.type === 'LOAN' && (
            <Button
              color='success'
              variant='contained'
              onClick={() =>
                window.location.replace(
                  `/inventory/kits/return?kitId=${kit.kit}`,
                )
              }
            >
              Return
            </Button>
          )}
          <Button
            color='success'
            variant='contained'
            onClick={() =>
              (window.location.href = `kit_restock?kitId=${kit.id}`)
            }
          >
            Restock
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
