import { Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

const AccordionSummaryContent = ({ index, order_date, return_date, loanee_name }) => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const display_return_date = new Date(return_date).toLocaleDateString();
  const display_order_date = new Date(order_date).toLocaleDateString();

  return (
    <Grid container spacing={5} direction="row">
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
                  <Typography variant='caption'>{display_return_date}</Typography>
              </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3}>
            <Grid
                container
                direction={isMobile ? 'column' : 'row'}
                alignItems={isMobile ? 'flex-start' : 'center'}
                sx={{ paddingLeft: "5px" }}
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
                    <Typography variant='caption'>{display_order_date}</Typography>
                </Grid>
            </Grid>
        </Grid>
        <Grid item xs={4}>
        <Grid
          container
          direction={isMobile ? 'column' : 'row'}
          alignItems={isMobile ? 'flex-start' : 'center'}
          sx={{ paddingLeft: "15px" }}
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
            <Typography variant='caption'>{loanee_name}</Typography>
          </Grid>
        </Grid>
        </Grid>
    </Grid>
  );
};

export default AccordionSummaryContent;
