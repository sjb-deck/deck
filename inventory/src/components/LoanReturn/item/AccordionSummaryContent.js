import { Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';

export const AccordionSummaryContent = ({
  index,
  orderDate,
  returnDate,
  loaneeName,
  isMobile,
}) => {
  const displayReturnDate = new Date(returnDate).toLocaleDateString();
  const displayOrderDate = new Date(orderDate).toLocaleDateString();
  return (
    <Grid container>
      <Grid item xs={2}>
        {index}
      </Grid>
      <Grid item xs={isMobile ? 5 : 3}>
        {displayReturnDate}
      </Grid>
      <Grid item xs={isMobile ? 5 : 4}>
        {displayOrderDate}
      </Grid>
      {!isMobile && (
        <Grid item xs={3}>
          {loaneeName}
        </Grid>
      )}
    </Grid>
  );
};
