import { Skeleton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';

export const UserAvatar = ({ user, size }) => {
  return user ? (
    <Tooltip title={`${user.extras.name}`}>
      <Avatar
        alt={`${user.extras.name}`}
        src={`${user.extras.profile_pic}`}
        sx={{ width: size, height: size }}
      />
    </Tooltip>
  ) : (
    <Skeleton variant='circular' width={size} height={size}>
      <Avatar />
    </Skeleton>
  );
};
