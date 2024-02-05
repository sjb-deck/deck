import React from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';

import { stringAvatar } from '../../utils';

export const KitInfoSection = ({ kitData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack
      direction={'column'}
      alignItems={'center'}
      sx={{ p: isMobile ? 2 : 8, pt: 10 }}
    >
      <Avatar {...stringAvatar(kitData?.name)} />
      <Typography variant='h3' align="center" noWrap>{kitData?.name}</Typography>
      <Typography variant='h6' align="center" noWrap>{kitData?.blueprint_name}</Typography>
      <Typography variant='overline' align="center" noWrap>
        {kitData?.status}, {kitData?.complete}
      </Typography>
    </Stack>
  );
};
