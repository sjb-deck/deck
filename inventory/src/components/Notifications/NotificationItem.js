import {
  Box,
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

  const KitItem = (item) => (
    <Grid container spacing={2} direction='row'>
      <Grid item>
        <Typography variant='subtitle1'>Item: {item.item.item_name}</Typography>
      </Grid>
      <Grid item>
        <Typography variant='subtitle1'>
          Quantity: {item.item.quantity}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant='subtitle1'>
          Expiry: {item.item.expiry_date}
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
            <Grid container spacing={2} direction={'row'}>
              <Grid item>
                <Typography variant='subtitle1'>Item: {issue.name}</Typography>
              </Grid>
              <Grid item>
                <Typography variant='subtitle1'>
                  Quantity: {issue.quantity}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant='subtitle1'>
                  Expiry: {issue.expiry_date}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
        {sectionKey === 'low_quantity_items' && (
          <Box sx={{ py: '8px' }}>
            <Grid container spacing={2} direction={'row'}>
              <Grid item>
                <Typography variant='subtitle1'>Item: {issue.name}</Typography>
              </Grid>
              <Grid item>
                <Typography variant='subtitle1'>
                  Quantity: {issue.total_quantity}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
        {sectionKey === 'kits_expiries' && (
          <Box sx={{ py: '8px' }}>
            <Grid container spacing={2} direction={'row'}>
              <Grid item>
                <Typography variant='subtitle1'>
                  Kit Name: {issue.kit_name}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant='subtitle1'>
                  Kit ID: {issue.kit_id}
                </Typography>
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
