import { Skeleton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';

import { UserPropType } from '../globals';

export const UserAvatar = ({ user, size }) => {
  return user ? (
    <Tooltip title={`${user.name}`}>
      <Avatar
        alt={`${user.name}`}
        src={`${user.profilepic}`}
        sx={{ width: size, height: size }}
      />
    </Tooltip>
  ) : (
    <Skeleton variant='circular' width={size} height={size}>
      <Avatar />
    </Skeleton>
  );
};

UserAvatar.propTypes = {
  user: UserPropType,
  size: PropTypes.number,
};
