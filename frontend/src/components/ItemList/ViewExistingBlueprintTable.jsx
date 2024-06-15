import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Grid,
  Stack,
  Box,
  Typography,
} from '@mui/material';
import React from 'react';

export const ViewExistingBlueprintTable = ({ items }) => {
  return (
    <Box className='dynamic-width'>
      <Accordion
        expanded={false}
        className='view-existing-blueprints-header'
        sx={{ marginBottom: 1 }}
      >
        <Box className='view-existing-blueprints-subheader'>
          <Grid container>
            <Grid item xs={2}>
              <Typography data-testid='item_id' variant={'h8'}>
                ID
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography data-testid='item_name' variant={'h8'}>
                Name
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Accordion>
      {items.map((item) => (
        <Accordion
          key={`Blueprint ${item.id}`}
          className='view-existing-blueprints'
        >
          <AccordionSummary
            data-testid='item_accordion'
            expandIcon={<ExpandMoreIcon />}
          >
            <Grid container>
              <Grid item xs={2}>
                <Typography data-testid='item_id' variant={'h8'}>
                  {item.id}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography data-testid='item_name' variant={'h8'}>
                  {item.name}
                </Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Divider variant='middle' sx={{ borderBottomWidth: 2 }} />
            <Stack spacing={1} sx={{ marginTop: 2, marginBottom: 1 }}>
              {item.complete_content.map((blueprintItem) => {
                return (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{blueprintItem.name}</span>
                    <span>{blueprintItem.quantity}</span>
                  </Box>
                );
              })}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};
