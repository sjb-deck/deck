import CallMadeIcon from '@mui/icons-material/CallMade';
import {
  Box,
  ButtonBase,
  createTheme,
  Grid,
  ThemeProvider,
  Typography,
} from '@mui/material';
import React from 'react';

export const NotificationItem = ({ sectionKey, issue, isMobile }) => {
  const theme = createTheme({
    typography: {
      subtitle1: {
        fontSize: isMobile ? 12 : 20,
      },
    },
  });

  const handleClick = () => {
    if (
      sectionKey === 'expired_items' ||
      sectionKey === 'expiring_items' ||
      sectionKey === 'low_quantity_items'
    ) {
      window.location.href = `items?search=${issue.name}`;
    } else if (sectionKey === 'kits_expiries') {
      window.location.href = `kits/kit_info?kitId=${issue.kit_id}`;
    }
  };

  const KitItem = (item) => (
    <Grid container spacing={2} direction='row'>
      <Grid item>
        <Typography variant='subtitle1'>Item: {item.item.item_name}</Typography>
      </Grid>
      <Grid item>
        <Typography variant='subtitle1'>
          Qty: {item.item.quantity}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant='subtitle1'>
          Exp: {item.item.expiry_date}
        </Typography>
      </Grid>
    </Grid>
  );

  return (
    <div>
      <ThemeProvider theme={theme}>
        {(sectionKey === 'expired_items' ||
          sectionKey === 'expiring_items') && (
          <Box sx={{ py: '8px' }}>
            <Grid container spacing={2} direction={'row'} width={'100%'}>
              <Grid item xs={4}>
                <Typography variant='subtitle1'>Item: {issue.name}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant='subtitle1'>
                  Qty: {issue.quantity}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant='subtitle1'>
                  Exp: {issue.expiry_date}
                </Typography>
              </Grid>
              <Grid item>
                <ButtonBase onClick={handleClick}>
                  <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    width='100%'
                    height='100%'
                  >
                    <CallMadeIcon fontSize='small' sx={{ color: '#00e676' }} />
                  </Box>
                </ButtonBase>
              </Grid>
            </Grid>
          </Box>
        )}
        {sectionKey === 'low_quantity_items' && (
          <Box sx={{ py: '8px' }}>
            <Grid container spacing={2} direction={'row'} width={'100%'}>
              <Grid item xs={5}>
                <Typography variant='subtitle1'>Item: {issue.name}</Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant='subtitle1'>
                  Qty: {issue.total_quantity}
                </Typography>
              </Grid>
              <Grid item>
                <ButtonBase onClick={handleClick}>
                  <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    width='100%'
                    height='100%'
                  >
                    <CallMadeIcon fontSize='small' sx={{ color: '#00e676' }} />
                  </Box>
                </ButtonBase>
              </Grid>
            </Grid>
          </Box>
        )}
        {sectionKey === 'kits_expiries' && (
          <Box sx={{ py: '8px' }}>
            <Grid container spacing={2} direction={'row'} width={'100%'}>
              <Grid item xs={5}>
                <Typography variant='subtitle1'>
                  Kit Name: {issue.kit_name}
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant='subtitle1'>
                  Kit ID: {issue.kit_id}
                </Typography>
              </Grid>
              <Grid item>
                <ButtonBase onClick={handleClick}>
                  <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    width='100%'
                    height='100%'
                  >
                    <CallMadeIcon fontSize='small' sx={{ color: '#00e676' }} />
                  </Box>
                </ButtonBase>
              </Grid>
            </Grid>
            {issue.expiring_items && (
              <Typography variant='subtitle1'>Expiring Items:</Typography>
            )}
            {issue.expiring_items &&
              issue.expiring_items.map((item, index) => (
                <Box key={index}>
                  <KitItem item={item} />
                </Box>
              ))}
            {issue.expired_items && (
              <Typography variant='subtitle1'>Expired Items:</Typography>
            )}
            {issue.expired_items &&
              issue.expired_items.map((item, index) => (
                <Box key={index}>
                  <KitItem item={item} />
                </Box>
              ))}
          </Box>
        )}
      </ThemeProvider>
    </div>
  );
};
