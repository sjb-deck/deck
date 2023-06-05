import React from 'react';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { user } from '/inventory/src/js/itemIndex.js';
import { MEDIA_ROOT } from '../globals';
import PropTypes from 'prop-types';

export const UserAvatar = ({ size }) => {
  return (
    <Tooltip title={`${user.fields.name}`}>
      <Avatar
        alt={`${user.fields.name}`}
        src={`${MEDIA_ROOT}${user.fields.profilepic}`}
        sx={{ width: size, height: size }}
      />
    </Tooltip>
  );
};

UserAvatar.propTypes = {
  size: PropTypes.number,
};
