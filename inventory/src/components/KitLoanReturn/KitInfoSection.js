import React from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';

import { stringAvatar } from '../../utils';

export const KitInfoSection = ({ kitData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack
      direction={{ xs: 'row', sm: 'column' }}
      alignItems={'center'}
      sx={{ padding: isMobile ? 2 : 8 }}
    >
      <Avatar {...stringAvatar(kitData?.name)} />
      <Stack>
        <Typography variant='h3'>{kitData?.name}</Typography>
        <Typography variant='h6'>{kitData?.blueprint_name}</Typography>
        <Typography variant='overline'>
          {kitData?.status}, {kitData?.complete}
        </Typography>
      </Stack>
    </Stack>
  );
};
