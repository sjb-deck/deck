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
import React from 'react';

const kitStatus = {
  ON_LOAN: 'On Loan',
  READY: 'Ready',
  SERVICING: 'Servicing',
  RETIRED: 'Retired',
};

export const KitInfo = ({ kit, isMobile }) => {
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
            {kit.name}
          </Grid>
          <Grid item xs={isMobile ? 5 : 4}>
            {kitStatus[kit.status]}
          </Grid>
          {!isMobile && (
            <Grid item xs={3}>
              {kit.complete === 'complete' ? 'Complete' : 'Incomplete'}
            </Grid>
          )}
        </Grid>
      </AccordionSummary>
      <AccordionDetails data-testid={`details-${kit.id}`}>
        <Divider variant='middle' sx={{ borderBottomWidth: 2 }} />
        <Stack spacing={1} sx={{ marginTop: 2, marginBottom: 1 }}>
          {kit.content.map((item) => {
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
      </AccordionDetails>
    </Accordion>
  );
};
