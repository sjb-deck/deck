import Tooltip from '@mui/material/Tooltip';

import { IMG_USER } from '../../globals/urls';
import { ImageAvatar } from '../ImageAvatar';

export const UserAvatar = ({ user, size }) => {
  return user && user.extras.profile_pic && user.extras.name ? (
    <Tooltip title={user.extras.name}>
      <ImageAvatar
        alt={user.extras.name}
        src={user.extras.profile_pic}
        size={size}
      />
    </Tooltip>
  ) : (
    <ImageAvatar alt='User Profile Picture' src={IMG_USER} size={size} />
  );
};
