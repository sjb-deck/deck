import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';

import { UserPropType } from '../globals';

export const UserAvatar = ({ user, size }) => {
  return (
    <Tooltip title={`${user.name}`}>
      <Avatar
        alt={`${user.name}`}
        src={`${user.profilepic}`}
        sx={{ width: size, height: size }}
      />
    </Tooltip>
  );
};

UserAvatar.propTypes = {
  user: UserPropType.isRequired,
  size: PropTypes.number,
};
