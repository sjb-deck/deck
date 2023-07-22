import { Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import PropTypes from 'prop-types';
import React from 'react';

const AccordionSummaryContent = ({
  index,
  orderDate,
  returnDate,
  loaneeName,
}) => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const displayReturnDate = new Date(returnDate).toLocaleDateString();
  const displayOrderDate = new Date(orderDate).toLocaleDateString();

  return (
    <Grid container spacing={5} direction='row'>
      <Grid item xs={1}>
        <Typography sx={{ marginBottom: '-4px' }}>{index}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Grid
          container
          direction={isMobile ? 'column' : 'row'}
          alignItems={isMobile ? 'flex-start' : 'center'}
        >
          <Grid item>
            <Typography
              sx={{
                fontSize: isMobile ? '8px' : '12px',
                marginBottom: isMobile ? '-4px' : '0px',
                marginTop: isMobile ? '-2px' : '0px',
              }}
            >
              {isMobile ? 'Return' : 'Return:'}
            </Typography>
          </Grid>
          {!isMobile && <Box sx={{ width: '15px' }} />}
          <Grid item sx={{ marginTop: isMobile ? '0px' : '-3px' }}>
            <Typography variant='caption'>{displayReturnDate}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Grid
          container
          direction={isMobile ? 'column' : 'row'}
          alignItems={isMobile ? 'flex-start' : 'center'}
          sx={{ paddingLeft: '5px' }}
        >
          <Grid item>
            <Typography
              sx={{
                fontSize: isMobile ? '8px' : '12px',
                marginBottom: isMobile ? '-4px' : '0px',
                marginTop: isMobile ? '-2px' : '0px',
              }}
            >
              {isMobile ? 'Order' : 'Order:'}
            </Typography>
          </Grid>
          {!isMobile && <Box sx={{ width: '15px' }} />}
          <Grid item sx={{ marginTop: isMobile ? '0px' : '-3px' }}>
            <Typography variant='caption'>{displayOrderDate}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={4}>
        <Grid
          container
          direction={isMobile ? 'column' : 'row'}
          alignItems={isMobile ? 'flex-start' : 'center'}
          sx={{ paddingLeft: '15px' }}
        >
          <Grid item>
            <Typography
              sx={{
                fontSize: isMobile ? '8px' : '12px',
                marginBottom: isMobile ? '-4px' : '0px',
                marginTop: isMobile ? '-2px' : '0px',
              }}
            >
              {isMobile ? 'Loanee' : 'Loanee:'}
            </Typography>
          </Grid>
          {!isMobile && <Box sx={{ width: '15px' }} />}
          <Grid item sx={{ marginTop: isMobile ? '0px' : '-3px' }}>
            <Typography variant='caption'>{loaneeName}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

AccordionSummaryContent.propTypes = {
  index: PropTypes.string.isRequired,
  orderDate: PropTypes.string.isRequired,
  returnDate: PropTypes.string.isRequired,
  loaneeName: PropTypes.string.isRequired,
};

export default AccordionSummaryContent;