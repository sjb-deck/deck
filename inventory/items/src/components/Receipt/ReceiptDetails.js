import { Divider, Stack } from '@mui/material';
import React from 'react';

import { ORDER_REASONS } from '../../../../src/globals';
import { Paper } from '../styled';

const attributeToReaderFriendlyText = (attribute) => {
  switch (attribute) {
    case 'user':
      return 'User';
    case 'date':
      return 'Date Ordered';
    case 'due_date':
      return 'Due Date';
    case 'return_date':
      return 'Return Date';
    case 'loan_active':
      return 'Loan Status';
    case 'other_info':
      return 'Other Info';
    case 'reason':
      return 'Reason';
    case 'action':
      return 'Action';
    case 'loanee_name':
      return 'Loanee Name';
    default:
      return attribute;
  }
};

export const ReceiptDetails = ({ details }) => {
  return (
    <Paper>
      <Stack
        divider={<Divider orientation='horizontal' flexItem />}
        spacing={1}
      >
        {Object.entries(details).map((detail) => {
          return (
            <div
              key={detail[0]}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <p style={{ margin: '0px', marginRight: '50px' }}>
                {attributeToReaderFriendlyText(detail[0])}
              </p>
              <p style={{ margin: '0px' }}>
                {detail[0] == 'reason' ? ORDER_REASONS[detail[1]] : detail[1]}
              </p>
            </div>
          );
        })}
      </Stack>
    </Paper>
  );
};
