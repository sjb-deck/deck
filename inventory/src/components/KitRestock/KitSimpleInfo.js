import { Avatar, Stack, Typography } from '@mui/material';
import React from 'react';

import { stringAvatar } from '../../utils';

export const KitSimpleInfo = ({ kitData }) => {
  return (
    <Stack
      sx={{
        display: 'flex',
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
