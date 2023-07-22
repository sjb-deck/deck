import { Grid, Paper, Typography, Avatar } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import PropTypes from 'prop-types';
import React from 'react';

const DrawerContent = ({ item }) => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const isPC = useMediaQuery('(min-width: 1000px)');

  return (
    <div>
      <Paper
        variant='elevation'
        style={{
          padding: '8px',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingBottom: '16px',
          borderRadius: '0px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '15px',
          }}
        >
          <Avatar
            alt='new-item'
            src={item.imgpic}
            style={{ width: '70px', height: '70px' }} // Increase the size
          />
        </div>
      </Paper>
      <Paper
        variant='elevation'
        style={{
          padding: '8px',
          paddingLeft: '16px',
          paddingRight: '16px',
          borderRadius: '0px',
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            width: isMobile ? '100%' : isPC ? '50%' : '70%',
          }}
        >
          <Grid item xs={6}>
            <Typography variant='body2' align='left'>
              Item Name:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body2' align='right'>
              {item.name}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        variant='elevation'
        style={{
          padding: '8px',
          paddingLeft: '16px',
          paddingRight: '16px',
          borderRadius: '0px',
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            width: isMobile ? '100%' : isPC ? '50%' : '70%',
          }}
        >
          <Grid item xs={6}>
            <Typography variant='body2' align='left'>
              Expiry Date:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body2' align='right'>
              {item.expiry ? item.expiry : 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        variant='elevation'
        style={{
          padding: '8px',
          paddingLeft: '16px',
          paddingRight: '16px',
          borderRadius: '0px',
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            width: isMobile ? '100%' : isPC ? '50%' : '70%',
          }}
        >
          <Grid item xs={6}>
            <Typography variant='body2' align='left'>
              Type:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body2' align='right'>
              {item.type}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        variant='elevation'
        style={{
          padding: '8px',
          paddingLeft: '16px',
          paddingRight: '16px',
          borderRadius: '0px',
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            width: isMobile ? '100%' : isPC ? '50%' : '70%',
          }}
        >
          <Grid item xs={6}>
            <Typography variant='body2' align='left'>
              Unit:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body2' align='right'>
              {item.unit}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        variant='elevation'
        style={{
          padding: '8px',
          paddingLeft: '16px',
          paddingRight: '16px',
          borderRadius: '0px',
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            width: isMobile ? '100%' : isPC ? '50%' : '70%',
          }}
        >
          <Grid item xs={9}>
            <Typography variant='body2' align='left'>
              Opened Qty Loaned:
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant='body2' align='right'>
              {item.quantity_opened}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        variant='elevation'
        style={{
          padding: '8px',
          paddingLeft: '16px',
          paddingRight: '16px',
          borderRadius: '0px',
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            width: isMobile ? '100%' : isPC ? '50%' : '70%',
          }}
        >
          <Grid item xs={9}>
            <Typography variant='body2' align='left'>
              Unopened Qty Loaned:
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography
              variant='body2'
              align='right'
              sx={{ marginBottom: '5px' }}
            >
              {item.quantity_unopened}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

DrawerContent.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    expiry: PropTypes.string,
    type: PropTypes.string,
    quantity_opened: PropTypes.number.isRequired,
    quantity_unopened: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired,
    imgpic: PropTypes.string,
  }).isRequired,
};

export default DrawerContent;