import { MenuItem, Stack, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { PropTypes } from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { getCartState } from '../../utils/cart-utils/getCartState';
import { Paper } from '../styled';

export const CartOptionsSelection = ({ onOptionChange }) => {
  const cartState = getCartState();
  const isWithdraw = cartState === 'Withdraw';
  const [selectedOption, setSelectedOption] = useState(
    isWithdraw ? 'loan' : 'item_restock',
  );

  const [loaneeName, setLoaneeName] = useState('');
  const [returnDate, setReturnDate] = useState(dayjs());
  const [reason, setReason] = useState('');

  const packageOption = useCallback(() => {
    const option = isWithdraw
      ? {
          option: selectedOption,
          ...withdrawOptions.find((option) => option.value === selectedOption)
            .fieldValues,
        }
      : {
          option: selectedOption,
          ...depositOptions.find((option) => option.value === selectedOption)
            .fieldValues,
        };
    return onOptionChange(option);
  }, [
    depositOptions,
    isWithdraw,
    onOptionChange,
    selectedOption,
    withdrawOptions,
  ]);

  useEffect(() => {
    packageOption();
  }, [packageOption, selectedOption]);

  const withdrawOptions = useMemo(
    () => [
      // TODO: Uncomment when phase 2 is ready
      // {
      //   label: 'Restocking of Pouches (Internal)',
      //   value: 'kit_restock',
      //   fields: [
      //     <Tooltip key='select_kit' title='Available in Phase 2'>
      //       <TextField
      //         select
      //         label='Select Kit'
      //         fullWidth
      //         disabled
      //         value={kitToRestock}
      //         onChange={(event) => setKitToRestock(event.target.value)}
      //       />
      //     </Tooltip>,
      //   ],
      //   fieldValues: { kit: kitToRestock },
      // },
      {
        label: 'Loan',
        value: 'loan',
        fields: [
          <TextField
            key='loanee_name'
            label='Loanee Name'
            fullWidth
            value={loaneeName}
            onChange={(event) => setLoaneeName(event.target.value)}
          />,
          <DatePicker
            key='return_date'
            label='Return Date'
            defaultValue={dayjs()}
            format='LL'
            disablePast
            sx={{ width: '100%' }}
            value={returnDate}
            onChange={(date) => setReturnDate(date)}
          />,
        ],
        fieldValues: { loanee: loaneeName, returnDate: returnDate },
      },
      {
        label: 'Unserviceable',
        value: 'unserviceable',
        fields: [],
        fieldValues: {},
      },
      {
        label: 'Others',
        value: 'others',
        fields: [
          <TextField
            key='others'
            label='Reason'
            fullWidth
            multiline
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />,
        ],
        fieldValues: { reason: reason },
      },
    ],
    [loaneeName, reason, returnDate],
  );

  const depositOptions = useMemo(
    () => [
      { label: 'Restocking of Stocks', value: 'item_restock', fields: [] },
      {
        label: 'Others',
        value: 'others',
        fields: [
          <TextField
            key='others'
            label='Reason'
            fullWidth
            multiline
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />,
        ],
        fieldValues: { reason: reason },
      },
    ],
    [reason],
  );

  return (
    <Paper style={{ padding: 20 }} id='test'>
      <Stack justifyContent='center' alignItems='center' spacing={2}>
        <Typography variant='h4' alignSelf='start'>
          {cartState} Cart
        </Typography>
        <TextField
          select
          label={`${cartState} Options`}
          fullWidth
          value={selectedOption}
          onChange={(event) => setSelectedOption(event.target.value)}
        >
          {isWithdraw
            ? withdrawOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))
            : depositOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
        </TextField>
        {selectedOption &&
          (isWithdraw
            ? withdrawOptions.find((option) => option.value === selectedOption)
                .fields
            : depositOptions.find((option) => option.value === selectedOption)
                .fields)}
      </Stack>
    </Paper>
  );
};

CartOptionsSelection.propTypes = {
  onOptionChange: PropTypes.func.isRequired,
};
