import { Badge, styled } from '@mui/material';

export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    padding: '0 4px',
    marginRight: 5,
  },
}));
