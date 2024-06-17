import { Grid } from '@mui/material';

import { getReadableDate } from '../../../utils';

export const AccordionSummaryContent = ({
  index,
  orderDate,
  returnDate,
  loaneeName,
  isMobile,
}) => {
  return (
    <Grid container>
      <Grid item xs={2}>
        {index}
      </Grid>
      <Grid item xs={isMobile ? 5 : 3}>
        {getReadableDate(returnDate).formattedDate}
      </Grid>
      <Grid item xs={isMobile ? 5 : 4}>
        {getReadableDate(orderDate).formattedDate}
      </Grid>
      {!isMobile && (
        <Grid item xs={3}>
          {loaneeName}
        </Grid>
      )}
    </Grid>
  );
};
