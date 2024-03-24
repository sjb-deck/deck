import Tooltip from '@mui/material/Tooltip';
import React from 'react';

import { ImageAvatar } from '../ImageAvatar';

export const UserAvatar = ({ user, size }) => {
  return user ? (
    <Tooltip title={`${user.extras.name}`}>
      <ImageAvatar
        alt={`${user.extras.name}`}
        src={`/get_image/${user.extras.profile_pic}`}
        size={size}
      />
    </Tooltip>
  ) : (
    <ImageAvatar
      alt='User Profile Picture'
      src='/static/inventory/img/blank_profile.webp'
      size={size}
    />
  );
};
