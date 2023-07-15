import { Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

const AccordionSummaryContent = ({ index, order_date, loanee_name }) => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const display_date = new Date(order_date).toLocaleDateString();

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Typography sx={{ marginBottom: '-4px' }}>{index}</Typography>
      </Grid>
      <Grid item xs={4.5} sx={{ marginRight: '8px' }}>
        <Typography sx={{ marginBottom: '-4px' }}>{display_date}</Typography>
      </Grid>
      <Grid item xs={5}>
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
              {isMobile ? 'Loaned To' : 'Loaned to:'}
            </Typography>
          </Grid>
          {!isMobile && <Box sx={{ width: '15px' }} />}
          <Grid item sx={{ marginTop: isMobile ? '0px' : '-3px' }}>
            <Typography variant='caption'>{loanee_name}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AccordionSummaryContent;
