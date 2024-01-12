import React from 'react';

import { Box, Grid, Slider, TextField } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';

export const ItemReturnSlider = ({ original_quantity, update }) => {
  const [value, setValue] = React.useState(original_quantity);

  const theme = useTheme();
  const shouldShowSlider = useMediaQuery(theme.breakpoints.up('md'));

  const handleSliderChange = (_, newValue) => {
    setValue(newValue);
    update(newValue);
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value === '' ? 0 : Number(event.target.value);
    setValue(newValue);
    update(newValue);
  };

  const handleBlur = () => {
    update(value);
    if (value < 0) {
      setValue(0);
      update(0);
    } else if (value > original_quantity) {
      setValue(original_quantity);
      update(original_quantity);
    }
  };

  /** Limits number input to length of 2 */
  const handleLimitInputLength = (e) => {
    e.target.value = Math.max(0, parseInt(e.target.value))
      .toString()
      .slice(0, 2);
  };

  return (
    <Grid container spacing={4} justifyContent='center'>
      {shouldShowSlider && (
        <Grid item xs>
          <Slider
            marks
            min={0}
            step={1}
            max={original_quantity}
            valueLabelDisplay='auto'
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby='input-slider'
          />
        </Grid>
      )}
      <Grid item>
        <TextField
          value={value}
          size='small'
          variant='outlined'
          onChange={handleInputChange}
          onBlur={handleBlur}
          onInput={handleLimitInputLength}
          inputProps={{
            step: 1,
            min: 0,
            max: original_quantity,
            type: 'number',
            'aria-labelledby': 'input-slider',
          }}
        />
      </Grid>
    </Grid>
  );
};
