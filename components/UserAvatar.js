import React from 'react';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { MEDIA_ROOT } from '../globals';
import PropTypes from 'prop-types';

export const UserAvatar = ({ user, size }) => {
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
  user: PropTypes.shape({
    fields: PropTypes.shape({
      name: PropTypes.string,
      profilepic: PropTypes.string,
      role: PropTypes.string,
      user: PropTypes.number,
    }),
    model: PropTypes.string,
    pk: PropTypes.number,
  }),
  size: PropTypes.number,
};
