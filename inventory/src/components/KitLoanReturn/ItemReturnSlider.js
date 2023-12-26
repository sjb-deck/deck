import React from 'react';

import { Box, Grid, Slider, Input, Typography } from '@mui/material';
import VolumeUp from '@mui/icons-material/VolumeUp';

export const ItemReturnSlider = () => {
  const [value, setValue] = React.useState(30);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  return (
    <Box sx={{ width: '80%', height: '100%', margin: 'auto' }}>
      <Grid container spacing={2} alignItems='center'>
        {/* <Grid item>
          <VolumeUp />
        </Grid> */}
        <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby='input-slider'
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size='small'
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 10,
              min: 0,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
