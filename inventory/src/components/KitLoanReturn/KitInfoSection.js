import React from 'react';
import { Avatar, Stack, Typography } from '@mui/material';

import { stringAvatar } from '../../utils';

export const KitInfoSection = ({ kitData }) => {
  return (
    <Stack
      sx={{
        padding: 8,
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar {...stringAvatar(kitData?.name)} />
      <Typography variant='h3'>{kitData?.name}</Typography>
      <Typography variant='h6'>{kitData?.blueprint_name}</Typography>
      <Typography variant='overline'>
        {kitData?.status}, {kitData?.complete}
      </Typography>
    </Stack>
  );
};
