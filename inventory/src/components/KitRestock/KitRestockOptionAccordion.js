import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import '../../globals/styles/inventoryBase.scss';
import { getReadableDate } from '../../utils';
import { NumberInput } from '../NumberInput';

export const KitRestockOptionAccordion = ({
  item,
  restockValues,
  setRestockValues,
  error,
}) => {
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState(item.current_quantity);
  const handleChange = () => {
    setOpen(!open);
  };
  const setRestockValue = (itemExpiryId, quantity) => {
    setRestockValues(
      restockValues.map((option) => {
        if (option.item_expiry_id == itemExpiryId) {
          return { ...option, quantity: quantity };
        }
        return option;
      }),
    );
  };

  useEffect(() => {
    if (!restockValues) return;
    setValue(
      restockValues.reduce((acc, option) => {
        if (!option.quantity) return acc;
        return acc + option.quantity;
      }, 0) + item.current_quantity,
    );
  }, [restockValues, item.current_quantity]);
  return (
    <Accordion
      expanded={open}
      onChange={handleChange}
      className='dynamic-width'
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1bh-content'
        id='panel1bh-header'
      >
        <Stack
          sx={{
            width: '100%',
          }}
        >
          <Stack
            direction='row'
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            spacing={2}
          >
            <Typography variant='h6'>{item.item_name}</Typography>
            <Chip
              label={`${value} / ${item.required_quantity}`}
              color={value == item.required_quantity ? 'success' : 'error'}
            />
          </Stack>
          <Typography variant='body2' color='error.main'>
            {error?.message}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        {item.item_options.map((option) => {
          return (
            <RestockOption
              key={option.item_expiry_id}
              option={option}
              setRestockValue={(v) => setRestockValue(option.item_expiry_id, v)}
            />
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};

const RestockOption = ({ option, setRestockValue }) => {
  const { formattedDate } = getReadableDate(option.expiry_date);
  const [value, setValue] = useState(0);
  return (
    <Stack
      direction='row'
      spacing={2}
      role='restockOption'
      aria-label={`Restock from ${option.item_expiry_id}`}
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '50px',
      }}
    >
      <Chip
        label={formattedDate.length ? formattedDate : 'No Expiry'}
        color={value > 0 ? 'success' : 'default'}
      />
      <NumberInput
        placeholder='Type a number…'
        value={value}
        aria-label={`Restock from ${option.item_expiry_id}`}
        onChange={(event, val) => {
          setValue(val);
          setRestockValue(val);
        }}
        min={0}
        max={option.quantity}
        color={value > 0 ? 'success' : 'default'}
        inputProps={{
          'aria-label': 'Search bar',
        }}
        endAdornment={
          <InputAdornment
            position='end'
            sx={{
              display: 'grid',
              gridColumn: '2/2',
              alignSelf: 'center',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              fontWeight: 600,
              lineHeight: 1.5,
              color: 'inherit',
            }}
          >
            / {option.quantity}
          </InputAdornment>
        }
      />
    </Stack>
  );
};
