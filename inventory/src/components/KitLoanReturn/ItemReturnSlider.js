import React from 'react';

import { Box, Grid, Slider, Input } from '@mui/material';

export const ItemReturnSlider = ({ quantity }) => {
  const [value, setValue] = React.useState(quantity);

  const handleSliderChange = (_, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > quantity) {
      setValue(quantity);
    }
  };

  /** Limits number input to length of 2 */
  const handleLimitInputLength = (e) => {
    e.target.value = Math.max(0, parseInt(e.target.value))
      .toString()
      .slice(0, 2);
  };

  return (
    <Box sx={{ width: '80%', height: '100%', margin: 'auto' }}>
      <Grid container spacing={4} alignItems='center'>
        {/* <Grid item>
          <VolumeUp />
        </Grid> */}
        <Grid item xs>
          <Slider
            marks
            min={0}
            step={1}
            max={quantity}
            valueLabelDisplay='auto'
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
            onInput={handleLimitInputLength}
            inputProps={{
              step: 1,
              min: 0,
              max: quantity,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
